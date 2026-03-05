import { Profile, Story } from "@prisma/client";
import { Avatar } from "@radix-ui/themes";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import StoryAvatarLink from "./StoryAvatarLink";

export default async function HomeTopRow({
    profiles,
    stories,
    myProfile,
}: {
    profiles: Profile[];
    stories: Story[];
    myProfile: Profile | null;
}) {
    // Group stories by author email for easy lookup
    const storyByAuthor = new Map<string, Story>()
    for (const story of stories) {
        // Keep only the most recent story per author
        if (!storyByAuthor.has(story.author)) {
            storyByAuthor.set(story.author, story)
        }
    }

    const myStory = myProfile ? storyByAuthor.get(myProfile.email) : null

    // Profiles that have active stories (for gradient ring)
    const profilesWithStories = profiles.filter(p => storyByAuthor.has(p.email))
    const profilesWithoutStories = profiles.filter(p => !storyByAuthor.has(p.email))

    return (
        <div className="flex gap-3 max-w-full lg:justify-center overflow-x-auto">
            {/* My story / New Story button */}
            <div className="flex flex-col items-center">
                {myStory && myProfile ? (
                    // I have an active story — show my avatar with gradient ring (turns pink while loading)
                    <StoryAvatarLink
                        href={`/stories/${myStory.id}`}
                        avatarSrc={myProfile.avatar || ''}
                        label="Your Story"
                    />
                ) : (
                    // No active story — show "New Story" button
                    <>
                        <Link
                            href="/create-story"
                            className="size-[90px] text-white rounded-full bg-gradient-to-t from-ig-orange to-ig-red flex items-center justify-center">
                            <PlusIcon size={42} />
                        </Link>
                        <p className="text-center text-gray-400 text-sm">
                            New Story
                        </p>
                    </>
                )}
            </div>

            {/* Followed profiles WITH active stories (gradient ring, turns pink on click) */}
            {profilesWithStories.map(profile => {
                const story = storyByAuthor.get(profile.email)!
                return (
                    <StoryAvatarLink
                        key={profile.id}
                        href={`/stories/${story.id}`}
                        avatarSrc={profile.avatar || ''}
                        label={profile.username || ''}
                    />
                )
            })}

            {/* Followed profiles WITHOUT active stories (no gradient ring) */}
            {profilesWithoutStories.map(profile => (
                <div key={profile.id} className="flex flex-col items-center justify-center">
                    <div className="inline-block p-1 rounded-full bg-gray-200">
                        <div className="inline-block p-0.5 bg-white rounded-full">
                            <Avatar
                                size="6"
                                radius="full"
                                fallback={'avatar'}
                                src={profile.avatar || ''}
                            />
                        </div>
                    </div>
                    <p className="text-center text-gray-400 text-sm truncate w-full max-w-[92px]">
                        {profile.username}
                    </p>
                </div>
            ))}
        </div>
    )
}