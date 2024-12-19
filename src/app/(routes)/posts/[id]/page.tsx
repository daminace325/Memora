import { getSinglePostData } from "@/actions";
import SinglePostContent from "@/components/SinglePostContent";


export default async function SinglePostPage({ params }: { params: { id: string } }) {
    const {
        post, authorProfile, comments,
        commmentsAuthors, myLike, myBookmark
    } = await getSinglePostData(params.id)
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