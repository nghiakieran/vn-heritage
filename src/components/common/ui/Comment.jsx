import React, { useState } from "react"
import { Loader2, Send, X, Trash2, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "./button"
import { toast } from "react-toastify"
import { useCreateDiscussMutation, useDeleteDiscussMutation, useGetDiscussByParentIdQuery } from "~/store/apis/disscussSlice"

const Comment = ({ comment, depth = 0, heritageId, currentUser, avatar }) => {
    const [replyForm, setReplyForm] = useState({ content: "", isOpen: false })
    const [showReplies, setShowReplies] = useState(false)

    const isOwnComment = currentUser?._id === comment.userId.toString()
    const hasReplies = (comment.comment_right - comment.comment_left) > 1 || showReplies
    const { data: repliesData = { comments: [] }, isLoading: isLoadingReplies } = useGetDiscussByParentIdQuery(
        { heritageId, parentId: comment._id },
        { skip: !showReplies }
    )

    const [createComment, { isLoading: isCreating }] = useCreateDiscussMutation()
    const [deleteComment, { isLoading: isDeleting }] = useDeleteDiscussMutation()

    const toggleReplyForm = () => {
        setReplyForm((prev) => ({
            content: prev.isOpen ? "" : prev.content,
            isOpen: !prev.isOpen
        }))
    }

    const handleReplyChange = (e) => {
        setReplyForm((prev) => ({ ...prev, content: e.target.value }))
    }

    const handleReplySubmit = async (e) => {
        e.preventDefault()
        if (!currentUser) {
            toast.error("Vui lòng đăng nhập để bình luận.")
            return
        }
        if (!replyForm.content.trim()) {
            toast.error("Bình luận không được để trống.")
            return
        }

        try {
            await createComment({ heritageId, content: replyForm.content, parentId: comment._id }).unwrap()
            toast.success("Trả lời đã được đăng!")
            setReplyForm({ content: "", isOpen: false })
            setShowReplies(true)
        } catch (err) {
            console.error("Failed to post reply:", err)
            toast.error("Không thể đăng trả lời. Vui lòng thử lại.")
        }
    }

    const handleDeleteComment = async () => {
        try {
            await deleteComment({ heritageId: heritageId, commentId: comment._id }).unwrap()
            toast.success("Bình luận đã được xóa!")
        } catch (err) {
            console.error("Failed to delete comment:", err)
            toast.error("Không thể xóa bình luận. Vui lòng thử lại.")
        }
    }

    const toggleReplies = () => {
        setShowReplies((prev) => !prev)
    }

    return (
        <div className={`mt-4 ${depth > 0 ? "ml-6 border-l-2 border-gray-200 pl-4" : ""}`}>
            <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                    {avatar ? (
                        <img src={avatar} alt={comment.username} className="w-8 h-8 rounded-full" />
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                            {comment.username[0].toUpperCase()}
                        </div>
                    )}
                </div>
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                            {comment.username}
                        </span>
                        {isOwnComment && (
                            <div className="flex space-x-2">

                                <button
                                    onClick={handleDeleteComment}
                                    className="text-sm text-red-500 hover:underline"
                                    disabled={isDeleting}
                                >
                                    <Trash2 className="w-4 h-4 inline mr-1" />
                                    Xóa
                                </button>
                            </div>
                        )}
                    </div>
                    <p className="mt-1 text-gray-700 dark:text-gray-300">{comment.content}</p>
                    <button
                        onClick={toggleReplyForm}
                        className="mt-2 text-sm text-primary hover:underline"
                    >
                        {replyForm.isOpen ? "Hủy" : "Trả lời"}
                    </button>

                    {replyForm.isOpen && (
                        <form onSubmit={handleReplySubmit} className="mt-3">
                            <textarea
                                className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary dark:bg-gray-700 dark:text-gray-200"
                                rows="3"
                                placeholder="Viết câu trả lời của bạn..."
                                value={replyForm.content}
                                onChange={handleReplyChange}
                                disabled={isCreating}
                            />
                            <div className="mt-2 flex space-x-2">
                                <Button type="submit" size="sm" disabled={isCreating}>
                                    {isCreating ? (
                                        <Loader2 className="w-4 h-4 animate-spin mr-1" />
                                    ) : (
                                        <Send className="w-4 h-4 mr-1" />
                                    )}
                                    Đăng trả lời
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={toggleReplyForm}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        </form>
                    )}

                    {hasReplies && (
                        <button
                            onClick={toggleReplies}
                            className="mt-2 text-sm text-primary hover:underline flex items-center"
                        >
                            {showReplies ? (
                                <ChevronUp className="w-4 h-4 mr-1" />
                            ) : (
                                <ChevronDown className="w-4 h-4 mr-1" />
                            )}
                            {showReplies ? "Ẩn trả lời" : "Hiện trả lời"}
                        </button>
                    )}
                </div>
            </div>

            {showReplies && (
                <div>
                    {isLoadingReplies ? (
                        <div className="flex justify-center mt-4">
                            <Loader2 className="w-4 h-4 animate-spin text-primary" />
                        </div>
                    ) : repliesData?.discussArray?.length === 0 ? (
                        <p className="mt-4 text-sm text-gray-500">Chưa có câu trả lời nào.</p>
                    ) : (
                        repliesData?.discussArray?.map((reply) => (
                            <Comment
                                key={reply._id}
                                comment={reply}
                                depth={depth + 1}
                                heritageId={heritageId}
                                currentUser={currentUser}
                                avatar={avatar}
                            />
                        ))
                    )}
                </div>
            )}
        </div>
    )
}

export default Comment
