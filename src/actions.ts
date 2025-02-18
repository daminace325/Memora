'use server'

import { auth } from "./auth"
import { prisma } from "./db"
import { uniq } from "lodash"

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

export async function updateProfile(data: FormData) {
    const userEmail = await getSessionEmailOrThrow()
    const newUserInfo = {
        username: data.get('username') as string,
        name: data.get('name') as string,
        subtitle: data.get('subtitle') as string,
        bio: data.get('bio') as string,
        avatar: data.get('avatar') as string,
    }
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
}


export async function postEntry(data: FormData) {
    const sessionEmail = await getSessionEmailOrThrow()
    const postDoc = await prisma.post.create({
        data: {
            author: sessionEmail,
            image: data.get('image') as string,
            description: data.get('description') as string || '',
        }
    })
    return postDoc.id
}


export async function postComment(data: FormData) {
    const authorEmail = await getSessionEmailOrThrow()
    return prisma.comment.create({
        data: {
            author: authorEmail,
            postId: data.get('postId') as string,
            text: data.get('text') as string,
        },
    })
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
    await prisma.like.create({
        data: {
            author: await getSessionEmailOrThrow(),
            postId,
        }
    })
    await updateLikesPostCount(postId)
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
}


export async function getSinglePostData(postId: string) {
    const post = await prisma.post.findFirst({
        where: {
            id: postId
        }
    })

    if (!post) {
        return null;
    }

    const authorProfile = await prisma.profile.findFirst({
        where: {
            email: post.author
        }
    })

    if (!authorProfile) {
        return null;
    }

    const comments = await prisma.comment.findMany({
        where: {
            postId: post.id
        }
    })

    const commmentsAuthors = await prisma.profile.findMany({
        where: {
            email: { in: uniq(comments.map(c => c.author)) },
        }
    })

    const myLike = await prisma.like.findFirst({
        where: {
            author: await getSessionEmailOrThrow(),
            postId: post.id,
        }
    })

    const myBookmark = await prisma.bookmark.findFirst({
        where: {
            author: await getSessionEmailOrThrow(),
            postId: post.id,
        }
    })

    return {
        post, 
        authorProfile, 
        comments,
        commmentsAuthors, 
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
}


export async function bookmarkPost(postId: string) {
    const sessionEmail = await getSessionEmailOrThrow()
    await prisma.bookmark.create({
        data: {
            author: sessionEmail,
            postId,
        }
    })
}



export async function unbookmarkPost(postId: string) {
    const sessionEmail = await getSessionEmailOrThrow()
    await prisma.bookmark.deleteMany({
        where: {
            author: sessionEmail,
            postId,
        }
    })
}