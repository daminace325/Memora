import { getSessionEmail } from "@/actions"
import StoryViewer from "@/components/StoryViewer"
import { prisma } from "@/db"
import { notFound } from "next/navigation"

export default async function StoryInModal({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    const story = await prisma.story.findFirst({
        where: { id },
    })

    if (!story) {
        return notFound()
    }

    const authorProfile = await prisma.profile.findFirst({
        where: { email: story.author },
    })

    if (!authorProfile) {
        return notFound()
    }

    const sessionEmail = await getSessionEmail()
    const isOwner = sessionEmail === story.author

    return <StoryViewer story={story} authorProfile={authorProfile} isOwner={isOwner} />
}
