import { getSinglePostData } from "@/actions"
import SinglePostContent from "./SinglePostContent"

export default async function ModalPostContent({ postId }: { postId: string }) {
    const {
        post, authorProfile, comments, 
        commmentsAuthors, myLike, myBookmark
    } = await getSinglePostData(postId)
    return (
        <SinglePostContent
                    post={post}
                    authorProfile={authorProfile}
                    comments={comments}
                    commentsAuthors={commmentsAuthors}
                    myLike={myLike}
                    myBookmark={myBookmark}
                />
    )
}