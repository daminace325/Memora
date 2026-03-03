import { auth } from "@/auth";
import { prisma } from "@/db";
import CommentForm from "./CommentForm";

export default async function SessionCommentForm({postId}: {postId: string}) {
    const session = await auth()
    if (!session?.user?.email) {
        return null;
    }
    const profile = await prisma.profile.findFirst({
        where: {
            email: session.user.email
        }
    })
    if (!profile) {
        return null;
    }

    return (
    <CommentForm postId={postId} avatar={profile.avatar || ''} />
    )
}