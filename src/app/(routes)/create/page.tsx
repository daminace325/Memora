'use client'

import { postEntry } from "@/actions";
import { Button, TextArea } from "@radix-ui/themes";
import { CloudUploadIcon, SendIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function CreatePage() {
    const [imageUrl, setImageUrl] = useState('')
    const [file, setFile] = useState<File | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const fileInRef = useRef<HTMLInputElement>(null)
    useEffect(() => {
        if (file) {
            setIsUploading(true)
            const data = new FormData();
            data.set("file", file);
            fetch("/api/upload", {
                method: "POST",
                body: data,
            }).then(response => {
                response.json().then(url => {
                    setImageUrl(url)
                    setIsUploading(false)
                })
            })
        }
    }, [file])

    return (
        <form
            className="max-w-md mx-auto"
            action={async data => {
                const id = await postEntry(data)
                window.location.href = `/posts/${id}`
            }}>
            <input type="hidden" name="image" value={imageUrl} />
            <div className="flex gap-4 flex-col">
                <div>
                    <div className="min-h-64 p-2 bg-gray-400 rounded-md relative">
                        {imageUrl && (
                            <Image 
                                src={imageUrl} 
                                className="rounded-md" 
                                alt="Uploaded image"
                                width={500}
                                height={400}
                                style={{
                                    width: '100%',
                                    height: 'auto'
                                }}
                            />
                        )}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <input
                                onChange={ev => setFile(ev.target.files?.[0] || null)}
                                className="hidden"
                                type="file"
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
                <div className="flex flex-col gap-2">
                    <TextArea name="description" className="h-16" placeholder="Add Photo Description..." />
                </div>
            </div>
            <div className="flex mt-4 justify-center">
                <Button>
                    <SendIcon size={16} />
                    Publish
                </Button>
            </div>
        </form>
    );
}