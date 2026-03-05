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

    return <StoryViewer story={story} authorProfile={authorProfile} />
}
