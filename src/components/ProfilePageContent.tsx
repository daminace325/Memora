
import ProfilePosts from "@/components/ProfilePosts";
import { Follower, Profile } from "@prisma/client";
import { Suspense } from "react";
import PreLoader from "./PreLoader";
import ProfilePageInfo from "./ProfilePageInfo";
import ProfileNav from "./ProfileNav";


export default function ProfilePageContent({
    profile,
    isOurProfile = false,
    ourFollow = null
}: {
    profile: Profile;
    isOurProfile?: boolean;
    ourFollow: Follower | null;
}) {

    return (
        <main>
            <ProfilePageInfo
                profile={profile}
                isOurProfile={isOurProfile}
                ourFollow={ourFollow} />
            <ProfileNav
                username={profile.username || ''}
                isOurProfile={isOurProfile} />
            <section className="mt-4">
                <Suspense fallback={<PreLoader />}>
                    <ProfilePosts email={profile.email} />
                </Suspense>
            </section>
        </main>
    )
}