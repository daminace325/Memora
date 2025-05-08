'use client'
import { updateProfile } from "@/actions";
import { Profile } from "@prisma/client";
import { Button, TextArea, TextField } from "@radix-ui/themes";
import { CloudUploadIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function SettingsForm({ profile }: { profile: Profile | null }) {
    const router = useRouter()
    const fileInRef = useRef<HTMLInputElement>(null)
    const [file, setFile] = useState<File | null>(null)
    const [avatarUrl, setAvatarUrl] = useState(profile?.avatar || null)
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)

    useEffect(() => {
        if (file) {
            setIsUploadingAvatar(true)
            const data = new FormData();
            data.set("file", file);
            fetch("/api/upload", {
                method: "POST",
                body: data,
            }).then(response => {
                response.json().then(url => {
                    setIsUploadingAvatar(false)
                    setAvatarUrl(url)
                })
            })
        }
    }, [file])
    return (
        <form action={async (data: FormData) => {
            await updateProfile(data)
            router.push('/profile')
            router.refresh()
        }}>
            <input type="hidden" name="avatar" value={avatarUrl || ''} />
            <div className="flex gap-4 items-center justify-center">
                <div>
                    <div className="bg-gray-400 size-24 rounded-full overflow-hidden shadow-md shadow-gray-400">
                        {avatarUrl ? (
                            <Image 
                                className="h-full w-full object-cover" 
                                src={avatarUrl} 
                                alt="Avatar" 
                                width={96}
                                height={96}
                            />
                        ) : (
                            <div className="h-full w-full flex items-center justify-center text-gray-600">
                                Upload an Image
                            </div>
                        )}
                    </div>

                </div>
                <div className="">
                    <input
                        type="file"
                        ref={fileInRef}
                        className="hidden"
                        onChange={ev => setFile(ev.target.files?.[0] || null)}
                    />
                    <Button
                        disabled={isUploadingAvatar}
                        type="button"
                        variant="surface"
                        onClick={() => fileInRef.current?.click()}
                    >

                        {!isUploadingAvatar && (
                            <CloudUploadIcon />
                        )}
                        {isUploadingAvatar ? 'Uploading...' : 'Choose Avatar'}
                    </Button>
                </div>
            </div>
            <p className="mt-2 font-bold">username</p>
            <TextField.Root
                name="username"
                defaultValue={profile?.username || ''}
                placeholder="your_username" />
            <p className="mt-2 font-bold">name</p>
            <TextField.Root
                name="name"
                defaultValue={profile?.name || ''}
                placeholder="your_name" />
            <p className="mt-2 font-bold">subtitle</p>
            <TextField.Root
                name="subtitle"
                defaultValue={profile?.subtitle || ''}
                placeholder="profession that describes you" />
            <p className="mt-2 font-bold">bio</p>
            <TextArea name="bio" defaultValue={profile?.bio || ''} />

            <div className="mt-4 flex justify-center">
                <Button variant="solid">Save Settings</Button>
            </div>
        </form>
    )
}