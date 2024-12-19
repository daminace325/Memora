import { prisma } from "@/db";
import { Avatar } from "@radix-ui/themes";
import Link from "next/link";
import PostsGrid from "./PostsGrid";
import { auth } from "@/auth";

export default async function SearchResults({ query }: { query: string }) {

    // const profiles = await prisma.profile.findMany({
    //     where: {
    //         OR: [
    //             { username: { contains: query }, },
    //             { name: { contains: query }, },
    //         ],
    //     },
    //     take: 10,
    // })
    
    const session = await auth()
    const profile = await prisma.profile.findFirst({
        where: {
            email: session?.user?.email as string, 
        },
    });
    
    const profiles = await prisma.profile.findMany({
        where: {
            AND: [
                {
                    OR: [
                        { username: { contains: query } },
                        { name: { contains: query } },
                    ],
                },
                { username: { not: profile?.username } },
            ],
        },
        take: 10,
    });
    
    const posts = await prisma.post.findMany({
        where: {
            description: { contains: query },
        },
        take: 100,
    })

    return (
        <div className="">
            <h1 className="text-lg mt-4">
                Search Results for "{query}"
            </h1>
            {profiles?.length > 0 && (
                <div className="grid mt-4 grid-cols-2 gap-2">
                    {profiles.map(profile => (
                        <Link
                            key={profile.id}
                            href={`/users/${profile.username}`}
                            className="flex gap-2 bg-gray-200 border border-gray-300 p-2 rounded-full">
                            <div className="">
                                <Avatar
                                    size="4"
                                    radius="full"
                                    fallback="user avatar"
                                    src={profile.avatar || ''} />
                            </div>
                            <div className="">
                                <h3 className="truncate max-w-[120px]">
                                    {profile.name}
                                </h3>
                                <h4 className="text-gray-500 text-sm truncate max-w-[120px]">
                                    @{profile.username}
                                </h4>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
            <div className="mt-4">
                <PostsGrid posts={posts} />
            </div>
        </div>
    )
}