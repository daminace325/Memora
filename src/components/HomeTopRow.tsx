import { Profile } from "@prisma/client";
import { Avatar } from "@radix-ui/themes";
import { PlusIcon } from "lucide-react";

export default async function HomeTopRow({
    profiles
}: {
    profiles: Profile[];
}) {
    
    return (
        <div className="flex gap-3 max-w-full lg:justify-center overflow-x-auto">
            <div className="">
                <button
                    className="size-[90px] text-white rounded-full bg-gradient-to-t from-ig-orange to-ig-red flex items-center justify-center">
                    <PlusIcon size={42} />
                </button>
                <p className="text-center text-gray-400 text-sm">New Story</p>
            </div>
            {profiles.map(profile => (
                <div key={profile.id} className="flex flex-col items-center justify-center">
                    <div className="">
                        <div className="inline-block p-1 rounded-full bg-gradient-to-tr from-ig-orange to bg-ig-red">
                            <div className="inline-block p-0.5 bg-white rounded-full">
                                <Avatar
                                    size="6"
                                    radius="full"
                                    fallback={'avatar'}
                                    src={profile.avatar || ''}
                                />
                            </div>
                        </div>
                    </div>
                    <p className="text-center text-gray-400 text-sm truncate w-full max-w-[92px]">
                        {profile.username}
                    </p>
                </div>
            ))}
        </div >
    )
}