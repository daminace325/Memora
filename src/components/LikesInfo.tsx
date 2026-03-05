'use client'

import { likePost, removeLikeFromPost } from "@/actions";
import { Like, Post } from "@prisma/client";
import { HeartIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LikesInfo({
    post,
    sessionLike,
    showText = true
}: {
    post: Post,
    sessionLike: Like | null,
    showText?: boolean
}) {
    const router = useRouter()
    const [likedByMe, setLikedByMe] = useState(!!sessionLike)
    const [isPending, setIsPending] = useState(false)
    return (
        <form
            action={async (data: FormData) => {
                if (isPending) return
                setIsPending(true)
                setLikedByMe(prev => !prev)
                try {
                    if (likedByMe) {
                        await removeLikeFromPost(data)
                    } else {
                        await likePost(data)
                    }
                    router.refresh()
                } finally {
                    setIsPending(false)
                }
            }}
            className="flex items-center gap-2">
            <input type="hidden" name="postId" value={post.id} />
            <button
                type="submit"
                disabled={isPending}
                className="disabled:opacity-50">
                <HeartIcon className={likedByMe ? 'text-red-500 fill-red-500' : ''} />
            </button>
            {showText && (
                <p>
                    {post.likesCount} people like this
                </p>
            )}
        </form>
    )
}