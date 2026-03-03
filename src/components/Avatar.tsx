import Image from "next/image"
import { UserIcon } from "lucide-react"

export default function Avatar({ src }: { src: string }) {
    return (
        <div className="size-16 aspect-square overflow-hidden rounded-full bg-gray-200 flex items-center justify-center">
            {src ? (
                <Image
                    className="h-full w-full object-cover"
                    src={src}
                    alt="User avatar"
                    width={64}
                    height={64}
                />
            ) : (
                <UserIcon className="w-8 h-8 text-gray-500" />
            )}
        </div>
    )
}