'use client'

import { followProfile, unfollowProfile } from "@/actions";
import { Follower } from "@prisma/client";
import { UserMinusIcon, UserPlusIcon } from "lucide-react";
import { useState } from "react";

export default function FollowButton({
    profileIdToFollow,
    ourFollow = null
}: {
    profileIdToFollow: string;
    ourFollow: Follower | null;
}) {
    const [isFollowed, setIsFollowed] = useState<boolean>(!!ourFollow)
    return (
        <form action={async () => {
            setIsFollowed(prev => !prev)
            if (isFollowed) {
                //unfollow
                await unfollowProfile(profileIdToFollow)
            } else {
                //follow
                await followProfile(profileIdToFollow)
            }
        }}>
            <button
                className={
                    isFollowed ? 'flex gap-2 px-5 py-3 rounded-full border-2 border-ig-red text-ig-red' :
                    "flex gap-2 bg-gradient-to-tr from-ig-orange to-ig-red to-80% px-5 py-3 rounded-full text-white text-lg"}>
                {isFollowed ? (<UserMinusIcon />) : (<UserPlusIcon />)}
                {isFollowed ? 'Unfollow' : 'Follow'}
            </button>
        </form>
    )
}