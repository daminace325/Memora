import { getSessionEmail, getSinglePostData } from "@/actions";
import SinglePostContent from "@/components/SinglePostContent";


export default async function SinglePostPage({ params }: { params: Promise<{ id: string }>; }) {
    const resolvedParams = await params;

    const sessionEmail = await getSessionEmail() || ''

    const {
        post,
        authorProfile,
        comments,
        commmentsAuthors,
        myLike,
        myBookmark,
    } = await getSinglePostData(resolvedParams.id);

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
    );
}
