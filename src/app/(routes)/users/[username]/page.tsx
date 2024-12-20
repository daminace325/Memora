import { getSessionEmail } from "@/actions"
import ProfilePageContent from "@/components/ProfilePageContent"
import { prisma } from "@/db"

export default async function UserProfilePage({
    params
}: {
    params: Promise<{ username: string }>
}) {
    const resolvedParams = await params
    
    const { username } = resolvedParams

    const sessionEmail = await getSessionEmail() || ''
    const profile = await prisma.profile.findFirstOrThrow({
        where: {
            username: username
        }
    })
    const ourFollow = await prisma.follower.findFirst({
        where: {
            followingProfileEmail: sessionEmail,
            followedProfileId: profile.id
        }
    })
    return (
        <ProfilePageContent
            isOurProfile={profile.email === sessionEmail}
            ourFollow={ourFollow}
            profile={profile} />
    )
}