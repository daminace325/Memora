import { auth } from "@/auth"
import HighlightsGrid from "@/components/HighlightsGrid"
import ProfileNav from "@/components/ProfileNav"
import ProfilePageInfo from "@/components/ProfilePageInfo"
import { prisma } from "@/db"
import { redirect } from "next/navigation"

export default async function HighlightsPage() {
    const session = await auth()
    const profile = await prisma.profile.findFirst({
        where: {
            email: session?.user?.email as string
        }
    })
    if (!profile) {
        return redirect('/settings')
    }

    // Expired stories become highlights
    const highlights = await prisma.story.findMany({
        where: {
            author: session?.user?.email as string,
            expiresAt: { lte: new Date() },
        },
        orderBy: {
            createdAt: 'desc',
        }
    })

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
