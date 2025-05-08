'use client'

import { Post } from '@prisma/client'
import Link from 'next/link'
import Masonry from 'react-masonry-css'
import Image from 'next/image'

export default function PostsGrid({posts}: {posts: Post[]}) {
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
                {posts.map(post => (
                    <Link href={`/posts/${post.id}`} key={post.id} className='block mb-4'>
                        <Image 
                            className='rounded-md'
                            src={post.image} 
                            alt={post.description || ""}
                            width={500}
                            height={500}
                            style={{
                                width: '100%',
                                height: 'auto'
                            }} />
                    </Link>
                ))}
            </Masonry>
        </div>
    )
}