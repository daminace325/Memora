"use client"

import { deletePost } from '@/actions'
import { Post } from '@prisma/client'
import { Trash } from 'lucide-react'
import { redirect } from 'next/navigation'
import React from 'react'

const DeleteButton = ({
    post
}: {
    post: Post
}) => {
    return (
        <div className='ml-2 flex items-center'>
            <form action={async () => {
                deletePost(post.id)
                redirect('/')
            }}>
                <button
                    type='submit'
                >
                    <Trash className='text-red-500 ' />
                </button>
            </form>
        </div>
    )
}

export default DeleteButton
