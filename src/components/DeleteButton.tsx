"use client"

import { deletePost } from '@/actions'
import { Post } from '@prisma/client'
import { Trash } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const DeleteButton = ({
    post
}: {
    post: Post
}) => {
    const [isDeleting, setIsDeleting] = useState(false)
    const router = useRouter()
    
    return (
        <div className='ml-2 flex items-center'>
            <form action={async () => {
                if (isDeleting) return
                setIsDeleting(true)
                
                try {
                    await deletePost(post.id)
                    router.push('/profile')
                    router.refresh()
                } catch (error) {
                    console.error('Error deleting post:', error)
                    setIsDeleting(false)
                }
            }}>
                <button
                    type='submit'
                    disabled={isDeleting}
                >
                    <Trash className={`text-red-500 ${isDeleting ? 'opacity-50' : ''}`} />
                </button>
            </form>
        </div>
    )
}

export default DeleteButton
