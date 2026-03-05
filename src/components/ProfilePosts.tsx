import { prisma } from "@/db";
import PostsGrid from "./PostsGrid";

export default async function ProfilePosts({ email }: { email: string }) {
    const posts = await prisma.post.findMany({
        where: {
            author: email
        }
    })

    return posts.length === 0 ? (
        <div className="text-center text-gray-400 py-12">
            <p className="text-lg">No posts yet</p>
        </div>
    ) : (
        <PostsGrid posts={posts} />
    )
}