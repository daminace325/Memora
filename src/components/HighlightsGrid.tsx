'use client'

import { Story } from '@prisma/client'
import Masonry from 'react-masonry-css'
import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'

export default function HighlightsGrid({ stories }: { stories: Story[] }) {
    if (stories.length === 0) {
        return (
            <div className="text-center text-gray-400 py-12">
                <p className="text-lg">No highlights yet</p>
                <p className="text-sm mt-1">Expired stories will appear here</p>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto">
            <Masonry
                breakpointCols={{
                    default: 4,
                    860: 3,
                    500: 2
                }}
                className="flex -ml-4"
                columnClassName="pl-4">
                {stories.map(story => (
                    <div key={story.id} className="mb-4 relative group">
                        <Image
                            className="rounded-md"
                            src={story.image}
                            alt="Story highlight"
                            width={500}
                            height={500}
                            style={{
                                width: '100%',
                                height: 'auto'
                            }}
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 rounded-b-md opacity-0 group-hover:opacity-100 transition-opacity">
                            <p className="text-white text-xs">
                                {formatDistanceToNow(new Date(story.createdAt), { addSuffix: true })}
                            </p>
                        </div>
                    </div>
                ))}
            </Masonry>
        </div>
    )
}
