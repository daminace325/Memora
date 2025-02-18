import { getSessionEmail, getSinglePostData } from "@/actions";
import SinglePostContent from "@/components/SinglePostContent";
import { redirect } from "next/navigation";

export default async function SinglePostPage({ params }: { params: Promise<{ id: string }>; }) {
    const resolvedParams = await params;
    const result = await getSinglePostData(resolvedParams.id);
    
    if (!result) {
        redirect('/profile')
    }

    const {
        post,
        authorProfile,
        comments,
        commmentsAuthors,
        myLike,
        myBookmark,
    } = result;

    const sessionEmail = await getSessionEmail() || ''

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
