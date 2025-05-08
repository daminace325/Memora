import Image from "next/image"

export default function Avatar({ src }: { src: string }) {
    return (
        <div className="size-16 aspect-square overflow-hidden rounded-full">
            <Image
                className="h-full w-full object-cover"
                src={src}
                alt="User avatar"
                width={64}
                height={64}
            />
        </div>
    )
}