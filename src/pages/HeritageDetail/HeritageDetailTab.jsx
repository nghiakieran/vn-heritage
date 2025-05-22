import { useState, useCallback, useMemo } from 'react'
import { Star, Loader2, MoreVertical, Trash2, ThumbsUp } from 'lucide-react'
import { Suspense } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/common/ui/Tabs'
import { Button } from '~/components/common/ui/Button'
import { HistoryTab, GalleryTab } from '~/components/lazyComponents'
import WriteReviewModal from '~/components/WriteReviewModal'
import { useGetAllCommentQuery } from '~/store/apis/commentApi'
import Avatar from '~/components/common/Avatar'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/store/slices/authSlice'
import { useDeleteCommentMutation, useLikeCommentMutation } from '~/store/apis/commentApi'
import { toast } from 'react-toastify'
import { Dialog, DialogHeader, DialogTitle, DialogDescription } from '~/components/common/ui/Dialog'

const HeritageDetailTabs = ({ data, isAuthenticated, navigate }) => {
  const [showWriteReview, setShowWriteReview] = useState(false)
  const [openMenuId, setOpenMenuId] = useState(null)
  const [deleteModal, setDeleteModal] = useState({ open: false, commentId: null })
  const currentUser = useSelector(selectCurrentUser)
  const [deleteComment] = useDeleteCommentMutation()
  const [likeComment] = useLikeCommentMutation()

  // Sử dụng useMemo để memoize query options, tránh re-render không cần thiết
  const queryOptions = useMemo(() => ({
    heritageId: data?._id,
    page: 1,
    limit: 10,
    sort: 'createdAt',
    order: 'desc',
  }), [data?._id])

  const { data: commentData, isLoading: isCommentsLoading } = useGetAllCommentQuery(
    queryOptions,
    { skip: !data?._id, refetchOnMountOrArgChange: false }
  )

  const comments = commentData?.comments || []
  console.log('Fetched comments:', comments)

  const hasComments = comments.length > 0

  const calculatedAverageRating = useMemo(() => {
    return hasComments
      ? comments.reduce((sum, comment) => sum + comment.rating, 0) / comments.length
      : 0
  }, [comments, hasComments])

  const averageRating = data?.stats?.averageRating || calculatedAverageRating

  const handleWriteReview = () => setShowWriteReview(true)

  const handleReviewSubmit = useCallback((reviewData) => {
    setShowWriteReview(false) // Đóng modal sau khi submit thành công
  }, [])

  const openDeleteModal = (commentId) => {
    setDeleteModal({ open: true, commentId })
    setOpenMenuId(null)
  }

  const confirmDelete = async () => {
    try {
      await deleteComment(deleteModal.commentId).unwrap()
      setDeleteModal({ open: false, commentId: null })
    } catch {
      toast.error('Xóa bình luận thất bại!')
    }
  }

  const closeDeleteModal = () => setDeleteModal({ open: false, commentId: null })

  const handleLike = async (commentId) => {
    try {
      await likeComment(commentId).unwrap()
    } catch {
      toast.error('Thao tác like thất bại!')
    }
  }

  return (
    <Tabs defaultValue="overview">
      <TabsList>
        <TabsTrigger value="overview">Tổng quan</TabsTrigger>
        <TabsTrigger value="history">Lịch sử</TabsTrigger>
        <TabsTrigger value="gallery">Hình ảnh</TabsTrigger>
        <TabsTrigger value="review">Đánh giá</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6">
        <h3 className="lcn-heritage-detail-title">Giới thiệu</h3>
        <p className="text-justify">{data?.description}</p>
        <p className="text-justify">
          Khi đến thăm {data?.name}, du khách sẽ được chiêm ngưỡng những công trình kiến trúc độc đáo, tìm hiểu về lịch
          sử hình thành và phát triển của di tích, cũng như khám phá những câu chuyện thú vị liên quan đến di tích này.
        </p>
      </TabsContent>

      <TabsContent value="history" className="space-y-6">
        <h3 className="lcn-heritage-detail-title">Các sự kiện lịch sử</h3>
        <Suspense fallback={<div>Đang tải...</div>}>
          <HistoryTab historicalEvents={data?.additionalInfo?.historicalEvents} />
        </Suspense>
      </TabsContent>

      <TabsContent value="gallery" className="space-y-6">
        <h3 className="lcn-heritage-detail-title">Hình ảnh</h3>
        <Suspense fallback={<div>Đang tải...</div>}>
          <GalleryTab images={data?.images} name={data?.name} />
        </Suspense>
      </TabsContent>

      <TabsContent value="review" className="space-y-6">
        <h3 className="lcn-heritage-detail-title">Đánh giá</h3>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="text-3xl font-bold mr-2">{averageRating.toFixed(1)}</div>
            <div className="flex flex-col">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    className={`${star <= Math.floor(averageRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">{data?.stats?.totalReviews || comments.length} đánh giá</span>
            </div>
          </div>
          {isAuthenticated && (
            <Button onClick={handleWriteReview} className="bg-blue-500 hover:bg-blue-600 text-white">
              Viết đánh giá
            </Button>
          )}
        </div>

        {isCommentsLoading ? (
          <div className="text-center py-4">
            <Loader2 className="w-6 h-6 animate-spin mx-auto" />
            <p className="text-sm text-muted-foreground">Đang tải đánh giá...</p>
          </div>
        ) : hasComments ? (
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment._id} className="border-b pb-6">
                <div className="flex justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Avatar 
                      src={comment?.user?.avatar}
                      name={comment?.user?.displayName}
                      size="md"
                    />
                    <div>
                      <div className="font-medium">{comment.user?.displayName || comment.user?.id || 'Ẩn danh'}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(comment.createdAt).toLocaleDateString('vi-VN', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={16}
                        className={`${star <= comment.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                    {/* Like button */}
                    <button
                      className={`ml-2 flex items-center gap-1 px-2 py-1 rounded-full border ${comment.likes?.includes(currentUser?._id) ? 'bg-blue-100 text-blue-600 border-blue-300' : 'bg-gray-100 text-gray-500 border-gray-200'} hover:bg-blue-200 transition`}
                      onClick={() => handleLike(comment._id)}
                      disabled={!isAuthenticated}
                    >
                      <ThumbsUp size={16} />
                      <span>{comment.likesCount || 0}</span>
                    </button>
                    {/* 3 dots menu for owner */}
                    {currentUser?._id === comment.user?.id && (
                      <div className="relative ml-2">
                        <button onClick={() => setOpenMenuId(openMenuId === comment._id ? null : comment._id)} className="p-1 rounded-full hover:bg-gray-200">
                          <MoreVertical size={18} />
                        </button>
                        {openMenuId === comment._id && (
                          <div className="absolute right-0 mt-2 w-28 bg-white border rounded shadow z-10">
                            <button
                              onClick={() => { setOpenMenuId(null); openDeleteModal(comment._id) }}
                              className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-gray-100 w-full"
                            >
                              <Trash2 size={16} /> Xóa
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-sm text-justify">{comment.content}</p>
                {comment.images && comment.images.length > 0 && (
                  <div className="mt-2">
                    {comment.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Hình ảnh ${index + 1}`}
                        className="max-w-[150px] rounded-lg mt-2"
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border border-dashed rounded-lg">
            <Star size={40} className="mx-auto text-muted-foreground mb-4 opacity-50" />
            <p className="text-muted-foreground">Chưa có đánh giá nào cho di tích này.</p>
            {!isAuthenticated && (
              <div className="mt-4">
                <p className="text-sm mb-3">Đăng nhập để viết đánh giá về trải nghiệm của bạn</p>
                <Button onClick={() => navigate('/login')}>Đăng nhập</Button>
              </div>
            )}
          </div>
        )}
        {showWriteReview && (
          <WriteReviewModal
            heritageId={data?._id}
            onClose={() => setShowWriteReview(false)}
            onSubmit={handleReviewSubmit}
          />
        )}
        <Dialog open={deleteModal.open} onClose={closeDeleteModal}>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa bình luận</DialogTitle>
            <DialogDescription>Bạn có chắc chắn muốn xóa bình luận này? Hành động này không thể hoàn tác.</DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 p-4">
            <Button variant="outline" onClick={closeDeleteModal}>Hủy</Button>
            <Button variant="destructive" onClick={confirmDelete}>Xóa</Button>
          </div>
        </Dialog>
      </TabsContent>
    </Tabs>
  )
}

export default HeritageDetailTabs