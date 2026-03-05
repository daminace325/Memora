'use client'

import { Profile, Story } from "@prisma/client"
import { Avatar } from "@radix-ui/themes"
import { Trash, XIcon } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { deleteStory } from "@/actions"

const STORY_DURATION = 5000 // 5 seconds auto-close

export default function StoryViewer({
    story,
    authorProfile,
    isOwner = false,
}: {
    story: Story
    authorProfile: Profile
    isOwner?: boolean
}) {
    const router = useRouter()
    const [progress, setProgress] = useState(0)
    const [isDeleting, setIsDeleting] = useState(false)
    const hasClosedRef = useRef(false)

    const closeStory = useCallback(() => {
        if (!hasClosedRef.current) {
            hasClosedRef.current = true
            router.back()
        }
    }, [router])

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                const next = prev + (100 / (STORY_DURATION / 50))
                if (next >= 100) {
                    clearInterval(interval)
                    return 100
                }
                return next
            })
        }, 50)

        return () => clearInterval(interval)
    }, [])

    // Separate effect to handle navigation when progress completes
    useEffect(() => {
        if (progress >= 100) {
            closeStory()
        }
    }, [progress, closeStory])

    return (
        <div
            className="fixed inset-0 z-50 bg-black flex items-center justify-center"
            onClick={closeStory}>
            <div
                className="relative max-w-lg w-full h-full flex flex-col"
                onClick={ev => ev.stopPropagation()}>
                {/* Progress bar */}
                <div className="absolute top-0 left-0 right-0 z-10 p-2">
                    <div className="h-1 bg-white/30 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-white rounded-full transition-all duration-50 ease-linear"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Header: avatar + username + time + close */}
                <div className="absolute top-4 left-0 right-0 z-10 flex items-center justify-between px-4">
                    <div className="flex items-center gap-2">
                        <Avatar
                            size="3"
                            radius="full"
                            src={authorProfile.avatar || ''}
                            fallback="avatar"
                        />
                        <span className="text-white font-semibold text-sm">
                            {authorProfile.username}
                        </span>
                        <span className="text-white/60 text-xs">
                            {formatDistanceToNow(new Date(story.createdAt), { addSuffix: true })}
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        {isOwner && (
                            <button
                                onClick={async (e) => {
                                    e.stopPropagation()
                                    if (isDeleting) return
                                    setIsDeleting(true)
                                    try {
                                        await deleteStory(story.id)
                                        closeStory()
                                    } catch (error) {
                                        console.error('Error deleting story:', error)
                                        setIsDeleting(false)
                                    }
                                }}
                                disabled={isDeleting}
                                className="text-red-400 hover:text-red-300 transition">
                                <Trash size={20} className={isDeleting ? 'opacity-50' : ''} />
                            </button>
                        )}
                        <button
                            onClick={closeStory}
                            className="text-white hover:text-white/80 transition">
                            <XIcon size={24} />
                        </button>
                    </div>
                </div>

                {/* Story image */}
                <div className="flex-1 relative flex items-center justify-center">
                    <Image
                        src={story.image}
                        alt={`Story by ${authorProfile.username}`}
                        fill
                        className="object-contain bg-black"
                        priority
                    />
                </div>
            </div>
        </div>
    )
}
