'use server'

import { auth } from "./auth"
import { prisma } from "./db"
import { uniq } from "lodash"
import { revalidatePath } from "next/cache"
import { z } from "zod"

export async function getSessionEmail(): Promise<string | null | undefined> {
    const session = await auth()
    return session?.user?.email

}

export async function getSessionEmailOrThrow(): Promise<string> {
    const userEmail = await getSessionEmail()
    if (!userEmail) {
        throw 'not logged in'
    }
    return userEmail
}

const profileSchema = z.object({
    username: z.string()
        .min(3, 'Username must be at least 3 characters')
        .max(30, 'Username must be at most 30 characters')
        .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
    name: z.string()
        .min(1, 'Name is required')
        .max(100, 'Name must be at most 100 characters'),
    subtitle: z.string().max(150, 'Subtitle must be at most 150 characters').optional().default(''),
    bio: z.string().max(500, 'Bio must be at most 500 characters').optional().default(''),
    avatar: z.preprocess(
        (val) => (typeof val === 'string' && val.trim() === '' ? undefined : val),
        z.string().optional().default('/no-user.jpg')
    ),
})

export async function updateProfile(data: FormData) {
    const userEmail = await getSessionEmailOrThrow()
    const parsed = profileSchema.safeParse({
        username: (data.get('username') as string)?.trim(),
        name: (data.get('name') as string)?.trim(),
        subtitle: (data.get('subtitle') as string)?.trim(),
        bio: (data.get('bio') as string)?.trim(),
        avatar: data.get('avatar') as string,
    })
    if (!parsed.success) {
        return { error: parsed.error.issues[0].message }
    }
    const newUserInfo = parsed.data
    await prisma.profile.upsert({
        where: {
            email: userEmail,
        },
        update: newUserInfo,
        create: {
            email: userEmail,
            ...newUserInfo
        }
    })
    revalidatePath('/')
    return { error: null }
}


export async function postEntry(data: FormData) {
    const sessionEmail = await getSessionEmailOrThrow()
    const image = data.get('image') as string
    if (!image) {
        throw new Error('Image is required')
    }
    const postDoc = await prisma.post.create({
        data: {
            author: sessionEmail,
            image,
            description: data.get('description') as string || '',
        }
    })
    return postDoc.id
}


export async function postComment(data: FormData) {
    const authorEmail = await getSessionEmailOrThrow()
    const comment = await prisma.comment.create({
        data: {
            author: authorEmail,
            postId: data.get('postId') as string,
            text: data.get('text') as string,
        },
    })
    revalidatePath('/')
    return comment
}

async function updateLikesPostCount(postId: string) {
    await prisma.post.update({
        where: {
            id: postId
        },
        data: {
            likesCount: await prisma.like.count({
                where: {
                    postId
                }
            })
        }
    })
}


export async function likePost(data: FormData) {
    const postId = data.get('postId') as string
    const author = await getSessionEmailOrThrow()
    await prisma.like.upsert({
        where: {
            postId_author: { postId, author },
        },
        create: { author, postId },
        update: {},
    })
    await updateLikesPostCount(postId)
    revalidatePath('/')
}


export async function removeLikeFromPost(data: FormData) {
    const postId = data.get('postId') as string
    await prisma.like.deleteMany({
        where: {
            postId,
            author: await getSessionEmailOrThrow(),
        }
    })
    await updateLikesPostCount(postId)
    revalidatePath('/')
}


export async function getSinglePostData(postId: string) {
    const post = await prisma.post.findFirst({
        where: { id: postId }
    })

    if (!post) {
        return null;
    }

    const sessionEmail = await getSessionEmailOrThrow();

    // Run independent queries in parallel
    const [authorProfile, comments, myLike, myBookmark] = await Promise.all([
        prisma.profile.findFirst({
            where: { email: post.author }
        }),
        prisma.comment.findMany({
            where: { postId: post.id }
        }),
        prisma.like.findFirst({
            where: { author: sessionEmail, postId: post.id }
        }),
        prisma.bookmark.findFirst({
            where: { author: sessionEmail, postId: post.id }
        }),
    ]);

    if (!authorProfile) {
        return null;
    }

    const commentsAuthors = await prisma.profile.findMany({
        where: {
            email: { in: uniq(comments.map(c => c.author)) },
        }
    })

    return {
        post,
        authorProfile,
        comments,
        commentsAuthors,
        myLike,
        myBookmark
    }
}


export async function deletePost(postId: string) {
    const sessionEmail = await getSessionEmailOrThrow();

    // Ensure that the session user is the author of the post before deleting
    const post = await prisma.post.findFirst({
        where: {
            id: postId,
            author: sessionEmail,
        },
    });

    if (!post) {
        throw new Error("Post not found or you are not authorized to delete it.");
    }

    // Clean up related data before deleting the post
    await prisma.comment.deleteMany({
        where: {
            postId,
        },
    });

    await prisma.like.deleteMany({
        where: {
            postId,
        },
    });

    await prisma.bookmark.deleteMany({
        where: {
            postId,
        },
    });

    // Finally, delete the post
    await prisma.post.delete({
        where: {
            id: postId,
        },
    });
    revalidatePath('/')
}



export async function followProfile(profileIdToFollow: string) {
    const sessionProfile = await prisma.profile.findFirstOrThrow({
        where: {
            email: await getSessionEmailOrThrow()
        }
    })
    await prisma.follower.create({
        data: {
            followingProfileEmail: sessionProfile.email,
            followingProfileId: sessionProfile.id,
            followedProfileId: profileIdToFollow,
        }
    })
    revalidatePath('/')
}


export async function unfollowProfile(profileIdToFollow: string) {
    const sessionProfile = await prisma.profile.findFirstOrThrow({
        where: {
            email: await getSessionEmailOrThrow()
        }
    });

    // Delete only the follower relationship with the specified profile
    await prisma.follower.deleteMany({
        where: {
            followingProfileId: sessionProfile.id, // The session profile's ID
            followedProfileId: profileIdToFollow  // The profile to unfollow
        }
    });
    revalidatePath('/')
}


export async function bookmarkPost(postId: string) {
    const sessionEmail = await getSessionEmailOrThrow()
    await prisma.bookmark.create({
        data: {
            author: sessionEmail,
            postId,
        }
    })
    revalidatePath('/')
}



export async function unbookmarkPost(postId: string) {
    const sessionEmail = await getSessionEmailOrThrow()
    await prisma.bookmark.deleteMany({
        where: {
            author: sessionEmail,
            postId,
        }
    })
    revalidatePath('/')
}


const storySchema = z.object({
    image: z.string().min(1, 'Image is required'),
})

export async function createStory(data: FormData) {
    const sessionEmail = await getSessionEmailOrThrow()

    const parsed = storySchema.safeParse({
        image: data.get('image') as string,
    })

    if (!parsed.success) {
        return { error: parsed.error.issues[0].message }
    }

    const story = await prisma.story.create({
        data: {
            author: sessionEmail,
            image: parsed.data.image,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
        }
    })

    revalidatePath('/')
    return { error: null, storyId: story.id }
}

export async function deleteStory(storyId: string) {
    const sessionEmail = await getSessionEmailOrThrow();

    const story = await prisma.story.findFirst({
        where: {
            id: storyId,
            author: sessionEmail,
        },
    });

    if (!story) {
        throw new Error("Story not found or you are not authorized to delete it.");
    }

    await prisma.story.delete({
        where: {
            id: storyId,
        },
    });

    revalidatePath('/');
}