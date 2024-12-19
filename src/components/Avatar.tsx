export default function Avatar({ src }: { src: string }) {
    return (
        <div className="size-16 aspect-square overflow-hidden rounded-full">
            <img
                className="h-full w-full object-cover"
                src={src}
                alt=""
            />
        </div>
    )
}