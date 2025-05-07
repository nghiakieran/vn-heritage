import React, { useState } from "react"
import { useSelector } from "react-redux"
import { Loader2, MessageSquare, Send } from "lucide-react"
import { Button } from "~/components/common/ui/button"
import { toast } from "react-toastify"
import { selectCurrentUser } from "~/store/slices/authSlice"
import Comment from "~/components/common/ui/Comment"
import { useCreateDiscussMutation, useGetDiscussByParentIdQuery } from "~/store/apis/disscussSlice"

const DiscussionSection = ({ heritageId }) => {
    const currentUser = useSelector(selectCurrentUser)
    const [newComment, setNewComment] = useState("")

    const { data: topLevelComments, isLoading: isLoadingComments, error: commentsError } = useGetDiscussByParentIdQuery({
        heritageId,
        parentId: null
    })

    console.log(topLevelComments);


    const [createComment, { isLoading: isCreating }] = useCreateDiscussMutation()

    const handleCommentSubmit = async (e) => {
        e.preventDefault()
        if (!currentUser) {
            toast.error("Vui lòng đăng nhập để bình luận.")
            return
        }
        if (!newComment.trim()) {
            toast.error("Bình luận không được để trống.")
            return
        }

        try {
            await createComment({ heritageId, content: newComment, parentId: null }).unwrap()
            toast.success("Bình luận đã được đăng!")
            setNewComment("")
        } catch (err) {
            console.error("Failed to post comment:", err)
            toast.error("Không thể đăng bình luận. Vui lòng thử lại.")
        }
    }

    return (
        <div className=" mx-auto py-8">
            <h2 className="text-primary text-2xl font-semibold flex items-center mb-2">
                <MessageSquare className="w-5 h-5 mr-2" />
                Hỏi và Đáp
            </h2>
            <div className="bg-gray-100 dark:bg-gray-900 rounded-lg shadow-lg p-6">
                {/* Comments List */}
                {isLoadingComments ? (
                    <div className="flex justify-center">
                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    </div>
                ) : commentsError ? (
                    <p className="text-center text-gray-500">
                        Không thể tải bình luận. Vui lòng thử lại.
                    </p>
                ) : !topLevelComments || !topLevelComments.discussArray || topLevelComments.discussArray.length === 0 ? (
                    <p className="mb-6 text-center text-gray-500">Chưa có bình luận nào. Hãy là người đầu tiên bình luận!</p>
                ) : (
                    <div className="space-y-4">
                        {topLevelComments?.discussArray?.map((comment) => (
                            <Comment
                                key={comment._id}
                                comment={comment}
                                heritageId={heritageId}
                                currentUser={currentUser}
                                avatar={comment?.user?.avatar}
                            />
                        ))}
                    </div>
                )}

                {/* Comment Form */}
                <form onSubmit={handleCommentSubmit} className="mt-5 flex flex-col items-end">
                    <textarea
                        className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary dark:bg-gray-700 dark:text-gray-200"
                        placeholder={currentUser ? "Chia sẻ suy nghĩ của bạn..." : "Vui lòng đăng nhập để bình luận."}
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        disabled={!currentUser || isCreating}
                    />
                    <Button
                        type="submit"
                        className="mt-3"
                        disabled={!currentUser || isCreating}
                    >
                        {isCreating ? (
                            <Loader2 className="w-4 h-4 animate-spin mr-1" />
                        ) : (
                            <Send className="w-4 h-4 mr-1" />
                        )}
                        Đăng bình luận
                    </Button>
                </form>


            </div>
        </div>
    )
}

export default DiscussionSection