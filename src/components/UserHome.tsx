import { Session } from "next-auth";
import HomeTopRow from "./HomeTopRow";
import { prisma } from "@/db";
import HomePosts from "./HomePosts";


export default async function UserHome({ session }: { session: Session }) {
    const sessionEmail = session?.user?.email || ''

    // Fetch follows and own profile in parallel (both only need sessionEmail)
    const [follows, myProfile] = await Promise.all([
        prisma.follower.findMany({
            where: { followingProfileEmail: sessionEmail }
        }),
        prisma.profile.findFirst({
            where: { email: sessionEmail }
        }),
    ])

    const profiles = await prisma.profile.findMany({
        where: {
            id: { in: follows.map(f => f.followedProfileId) }
        }
    })

    // Fetch active stories (depends on profiles list)
    const activeStories = await prisma.story.findMany({
        where: {
            author: { in: [sessionEmail, ...profiles.map(p => p.email)] },
            expiresAt: { gt: new Date() },
        },
        orderBy: { createdAt: 'desc' },
    })

    return (
        <div className="flex flex-col gap-8">
            <HomeTopRow
                profiles={profiles}
                stories={activeStories}
                myProfile={myProfile}
            />
            <HomePosts profiles={profiles} />
        </div>
    )
}