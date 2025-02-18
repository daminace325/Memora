import { getSessionEmail, getSinglePostData } from "@/actions"
import SinglePostContent from "./SinglePostContent"
import { redirect } from "next/navigation"

export default async function ModalPostContent({ postId }: { postId: string }) {
    const result = await getSinglePostData(postId)
    
    if (!result) {
        redirect('/profile')
    }
    
    const {
        post, authorProfile, comments,
        commmentsAuthors, myLike, myBookmark
    } = result
    
    const sessionEmail = await getSessionEmail()
    
    return (
        <SinglePostContent
            post={post}
            authorProfile={authorProfile}
            comments={comments}
            commentsAuthors={commmentsAuthors}
            myLike={myLike}
            myBookmark={myBookmark}
            isOurProfile={post.author === sessionEmail}
        />
    )
}