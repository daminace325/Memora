'use client'

import { createStory } from "@/actions";
import { Button } from "@radix-ui/themes";
import { CloudUploadIcon, SendIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function CreateStoryPage() {
    const [imageUrl, setImageUrl] = useState('')
    const [file, setFile] = useState<File | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const fileInRef = useRef<HTMLInputElement>(null)
    const router = useRouter()

    useEffect(() => {
        if (file) {
            setIsUploading(true)
            const data = new FormData();
            data.set("file", file);
            fetch("/api/upload", {
                method: "POST",
                body: data,
            }).then(response => {
                if (!response.ok) {
                    throw new Error('Upload failed')
                }
                return response.json()
            }).then(url => {
                setImageUrl(url)
            }).catch(err => {
                console.error(err)
                alert('Failed to upload image. Please try again.')
            }).finally(() => {
                setIsUploading(false)
            })
        }
    }, [file])

    return (
        <form
            className="max-w-md mx-auto"
            action={async data => {
                const result = await createStory(data)
                if (result?.error) {
                    alert(result.error)
                    return
                }
                router.push('/')
            }}>
            <h1 className="text-2xl font-bold text-center mb-6">Add to Your Story</h1>
            <input type="hidden" name="image" value={imageUrl} />
            <div className="flex gap-4 flex-col">
                <div>
                    <div className="min-h-64 max-h-[500px] overflow-hidden p-2 bg-gray-400 rounded-md relative">
                        {imageUrl && (
                            <Image
                                src={imageUrl}
                                className="rounded-md"
                                alt="Story image"
                                width={500}
                                height={400}
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                    maxHeight: '480px',
                                    objectFit: 'contain',
                                }}
                            />
                        )}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <input
                                onChange={ev => setFile(ev.target.files?.[0] || null)}
                                className="hidden"
                                type="file"
                                accept="image/*"
                                ref={fileInRef} />
                            <Button
                                disabled={isUploading}
                                onClick={() => fileInRef?.current?.click()}
                                type="button"
                                variant="surface"
                            >
                                {!isUploading && (
                                    <CloudUploadIcon size={16} />
                                )}
                                {isUploading ? 'Uploading...' : 'Choose Image'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <p className="text-center text-gray-500 text-sm mt-2">
                Your story will be visible for 24 hours, then moved to highlights.
            </p>
            <div className="flex mt-4 justify-center">
                <Button disabled={!imageUrl || isUploading}>
                    <SendIcon size={16} />
                    Share Story
                </Button>
            </div>
        </form>
    );
}
