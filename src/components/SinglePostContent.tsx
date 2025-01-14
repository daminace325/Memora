import Comment from "@/components/Comment"
import SessionCommentForm from "@/components/SessionCommentForm"
import { Suspense } from "react"
import LikesInfo from "@/components/LikesInfo"
import { Bookmark, Comment as CommentModel, Like, Post, Profile } from "@prisma/client"
import BookmarkButton from "./BookmarkButton"
import Description from "./Description"
import DeleteButton from "./DeleteButton"

export default function SinglePostContent({
    post,
    authorProfile,
    comments,
    commentsAuthors,
    myLike,
    myBookmark,
    isOurProfile
}: {
    post: Post;
    authorProfile: Profile;
    comments: CommentModel[];
    commentsAuthors: Profile[];
    myLike: Like | null;
    myBookmark: Bookmark | null;
    isOurProfile?: boolean;
}) {
    return (
        <div className="w-full">
            <div className="grid md:grid-cols-2 gap-4">
                <div className="ml-auto">
                    <img
                        className="rounded-lg"
                        src={post.image}
                        alt={post.description} />
                </div>
                <div className="">
                    {/* <Comment
                        createdAt={post.createdAt}
                        text={post.description}
                        authorProfile={authorProfile} /> */}
                    <Description
                        createdAt={post.createdAt}
                        text={post.description}
                        authorProfile={authorProfile} />
                    <div className="pt-4 flex flex-col gap-4 max-h-72 overflow-y-auto">
                        {comments.map(comment => (
                            <div key={comment.id}>
                                <Comment
                                    createdAt={comment.createdAt}
                                    text={comment.text}
                                    authorProfile={commentsAuthors.find(a => a.email === comment.author)} />
                            </div>
                        ))}
                    </div>
                    <div className="flex text-gray-700 items-center justify-between gap-2 py-4 border-t mt-4 border-t-gray-300">
                        <LikesInfo post={post} sessionLike={myLike} />
                        <div className="flex items-center">
                            <BookmarkButton
                                post={post}
                                sessionBookmark={myBookmark} />

                            {isOurProfile && <DeleteButton
                                post={post}
                            />
                            }

                        </div>
                    </div>
                    <div className="pt-8 border-t border-t-gray-300">
                        <Suspense>
                            <SessionCommentForm postId={post.id} />
                        </Suspense>
                    </div>
                </div>
            </div>
        </div>

    )
}