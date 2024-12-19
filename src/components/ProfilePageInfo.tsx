import { CheckIcon, CogIcon } from "lucide-react";
import BackButton from "./BackButton";
import Link from "next/link";
import FollowButton from "./FollowButton";
import { Follower, Profile } from "@prisma/client";

export default function ProfilePageInfo({
    profile,
    isOurProfile,
    ourFollow
}: {
    profile: Profile;
    isOurProfile: boolean;
    ourFollow: Follower | null;
}) {
    return (
        <div>
            <section className="flex justify-between items-center">
                <BackButton />
                <div className="font-bold flex items-center gap-2">
                    {profile.username}
                    <div className="size-5 rounded-full bg-ig-red inline-flex justify-center items-center text-white">
                        <CheckIcon size={16} />
                    </div>
                </div>
                <div className="">
                    {isOurProfile && (
                        <Link href='/settings'>
                            <CogIcon />
                        </Link>
                    )}
                </div>
            </section>
            <section className="mt-8 flex justify-center">
                <div className="size-48 p-2 rounded-full bg-gradient-to-tr from-ig-orange to bg-ig-red">
                    <div className="size-44 p-2 bg-white rounded-full">
                        <div className="size-40 aspect-square overflow-hidden rounded-full">
                            <div className="bg-gray-400 size-24 rounded-full overflow-hidden shadow-md shadow-gray-400">
                                {profile.avatar ? (
                                    <img className="h-full w-full object-cover" src={profile.avatar} alt="Avatar" />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center">
                                        No Image
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="text-center mt-4">
                <h1 className="text-xl font-bold">
                    {profile.name}
                </h1>
                <p className="text-gray-500 mt-1 mb-1">
                    {profile.subtitle}
                </p>
                <p>
                    {profile.bio}
                </p>
            </section>
            {!isOurProfile && (
                <section className="flex justify-center my-3">
                    <FollowButton
                        ourFollow={ourFollow}
                        profileIdToFollow={profile.id} />
                </section>
            )}
        </div>
    )
}