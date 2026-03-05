import { auth } from "@/auth"
import HighlightsGrid from "@/components/HighlightsGrid"
import ProfileNav from "@/components/ProfileNav"
import ProfilePageInfo from "@/components/ProfilePageInfo"
import { prisma } from "@/db"
import { redirect } from "next/navigation"

export default async function HighlightsPage() {
    const session = await auth()
    const email = session?.user?.email as string

    // Profile and highlights are independent — fetch in parallel
    const [profile, highlights] = await Promise.all([
        prisma.profile.findFirst({ where: { email } }),
        prisma.story.findMany({
            where: {
                author: email,
                expiresAt: { lte: new Date() },
            },
            orderBy: { createdAt: 'desc' },
        }),
    ])

    if (!profile) {
        return redirect('/settings')
    }

    return (
        <div className="">
            <ProfilePageInfo
                profile={profile}
                isOurProfile={true}
                ourFollow={null} />
            <ProfileNav
                username={profile.username || ''}
                isOurProfile={true} />
            <div className="mt-4">
                <HighlightsGrid stories={highlights} />
            </div>
        </div>
    )
}
