import { prisma } from "@/db"
import { Profile } from "@prisma/client"
import { Avatar } from "@radix-ui/themes"
import LikesInfo from "./LikesInfo"
import { getSessionEmailOrThrow } from "@/actions"
import Link from "next/link"
import BookmarkButton from './BookmarkButton'
import Image from "next/image"

export default async function HomePosts({
    profiles,
}: {
    profiles: Profile[]
}) {
    const posts = await prisma.post.findMany({
        where: {
            author: { in: profiles.map(p => p.email) }
        },
        orderBy: {
            createdAt: 'desc'
        },
        take: 100
    })

    const likes = await prisma.like.findMany({
        where: {
            author: await getSessionEmailOrThrow(),
            postId: { in: posts.map(p => p.id) },
        }
    })

    const bookmarks = await prisma.bookmark.findMany({
        where: {
            author: await getSessionEmailOrThrow(),
            postId: { in: posts.map(p => p.id) },
        }
    })

    return (
        <div className="max-w-md mx-auto flex flex-col gap-16">
            {posts.map(post => {
                const profile = profiles.find(p => p.email === post.author)
                return (
                    <div
                        className=""
                        key={post.id}>
                        <Link href={`/posts/${post.id}`}>
                            <Image
                                className="block shadow-sm shadow-black/50 rounded-lg w-full object-cover"
                                src={post.image}
                                alt={post.description || "Post image"}
                                width={500}
                                height={500}
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                    maxHeight: '600px'
                                }}
                            />
                        </Link>
                        <div className="flex items-center gap-2 mt-3 justify-between">
                            <div className="flex gap-2 items-center">
                                <Avatar
                                    radius="full"
                                    size="3"
                                    src={profile?.avatar || ''}
                                    fallback="avatar" />
                                <Link
                                    className="font-bold text-gray-700"
                                    href={`/users/${profile?.username}`}>
                                    {profile?.name}
                                </Link>
                            </div>
                            <div className="flex gap-2 items-center">
                                <LikesInfo
                                    post={post}
                                    sessionLike={likes.find(like => like.postId === post.id) || null}
                                    showText={false} />
                                    <BookmarkButton 
                                    post={post} 
                                    sessionBookmark={bookmarks.find(b => b.postId === post.id) || null} />
                            </div>
                        </div>
                        <p className="mt-1 text-slate-600">
                            {post.description}
                        </p>
                    </div>
                )
            })}
        </div>
    )
}