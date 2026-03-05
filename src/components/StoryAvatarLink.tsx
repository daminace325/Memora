'use client'

import { Avatar } from "@radix-ui/themes"
import { useRouter } from "next/navigation"
import { ReactNode, useTransition } from "react"

export default function StoryAvatarLink({
    href,
    avatarSrc,
    label,
    children,
}: {
    href: string
    avatarSrc: string
    label: string
    children?: ReactNode
}) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    function handleClick() {
        startTransition(() => {
            router.push(href)
        })
    }

    const ringClass = isPending
        ? 'bg-pink-400'
        : 'bg-gradient-to-tr from-ig-orange to-ig-red'

    return (
        <button
            onClick={handleClick}
            className="flex flex-col items-center justify-center cursor-pointer">
            <div className={`inline-block p-1 rounded-full ${ringClass} transition-colors`}>
                <div className="inline-block p-0.5 bg-white rounded-full">
                    {children ?? (
                        <Avatar
                            size="6"
                            radius="full"
                            fallback={'avatar'}
                            src={avatarSrc}
                        />
                    )}
                </div>
            </div>
            <p className="text-center text-gray-400 text-sm truncate w-full max-w-[92px]">
                {label}
            </p>
        </button>
    )
}
