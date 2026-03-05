import { getSessionEmail } from "@/actions"
import StoryViewer from "@/components/StoryViewer"
import { isValidObjectId, prisma } from "@/db"
import { notFound } from "next/navigation"

export default async function StoryInModal({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    if (!isValidObjectId(id)) {
        return notFound()
    }

    // Fetch story and session email in parallel
    const [story, sessionEmail] = await Promise.all([
        prisma.story.findFirst({ where: { id } }),
        getSessionEmail(),
    ])

    if (!story) {
        return notFound()
    }

    const authorProfile = await prisma.profile.findFirst({
        where: { email: story.author },
    })

    if (!authorProfile) {
        return notFound()
    }

    const isOwner = sessionEmail === story.author

    return <StoryViewer story={story} authorProfile={authorProfile} isOwner={isOwner} />
}
