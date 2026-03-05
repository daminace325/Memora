import { Session } from "next-auth";
import HomeTopRow from "./HomeTopRow";
import { prisma } from "@/db";
import HomePosts from "./HomePosts";


export default async function UserHome({ session }: { session: Session }) {
    const sessionEmail = session?.user?.email || ''

    const follows = await prisma.follower.findMany({
        where: {
            followingProfileEmail: sessionEmail,
        }
    })

    const profiles = await prisma.profile.findMany({
        where: {
            id: { in: follows.map(f => f.followedProfileId) }
        }
    })

    // Fetch current user's profile and active stories in parallel
    const [myProfile, activeStories] = await Promise.all([
        prisma.profile.findFirst({
            where: { email: sessionEmail }
        }),
        prisma.story.findMany({
            where: {
                author: { in: [sessionEmail, ...profiles.map(p => p.email)] },
                expiresAt: { gt: new Date() },
            },
            orderBy: { createdAt: 'desc' },
        }),
    ])

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