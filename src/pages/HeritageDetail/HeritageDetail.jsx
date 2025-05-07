import { useNavigate, useParams } from 'react-router-dom'
import { useState, Suspense, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useGetHeritagesBySlugQuery, useGetHeritagesQuery } from '~/store/apis/heritageApi'
import HeritageCard from '~/components/Heritage/HeritageCard'
import HeritageDetailSkeleton from './HeritageDetailSkeleton'
import { Button } from '~/components/common/ui/Button'
import { selectCurrentUser } from '~/store/slices/authSlice'
import { MessageCircle, X } from 'lucide-react'
import { Dialog, DialogDescription, DialogHeader, DialogTitle } from '~/components/common/ui/Dialog'
import { 
  HeritageChat, 
  LeaderboardTable, 
  HeritageKnowledgeTest, 
  HeritageDetailTabs, 
  HeritageFeatures, 
  HeritageInfo, 
  HeritageHeader 
} from '~/components/lazyComponents'
import ErrorBoundary from './ErrorBoundary'

const HeritageDetail = () => {
  const { nameSlug } = useParams()
  const navigate = useNavigate()
  const { data, isFetching, isLoading, isError } = useGetHeritagesBySlugQuery(nameSlug)
  const id = data?._id
  const userInfo = useSelector(selectCurrentUser)
  const isAuthenticated = !!userInfo
  const { data: allHeritages } = useGetHeritagesQuery({
    page: 1,
    limit: 50
  })
  console.log('Heritage data:', data._)
  // Logic để random 3 di tích liên quan
  const getRandomRelatedHeritages = useMemo(() => {
    if (!allHeritages?.heritages || !id) return []
    
    // Lọc bỏ di tích hiện tại
    const otherHeritages = allHeritages.heritages.filter(item => item._id !== id)
    
    // Trộn ngẫu nhiên mảng
    const shuffled = [...otherHeritages].sort(() => Math.random() - 0.5)
    
    // Lấy 3 di tích đầu tiên
    return shuffled.slice(0, 3)
  }, [allHeritages, id])

  const [activeFeature, setActiveFeature] = useState(null)
  const [isChatOpen, setIsChatOpen] = useState(false)

  const handleFeatureClick = (feature) => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    if (feature === 'chatroom') {
      navigate(`/chat/heritage/${nameSlug}`, { 
        state: { 
          heritageName: data?.name,
          heritageId: id
        } 
      })
      return
    }
    setActiveFeature(feature)
  }

  const closeFeatureDialog = () => {
    setActiveFeature(null)
  }

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen)
  }

  if (isError) {
    return (
      <div className='lcn-container-x py-16 text-center mt-32'>
        <h2 className='text-2xl font-medium mb-4'>Có lỗi xảy ra</h2>
        <p className='text-muted-foreground mb-6'>Không thể tải thông tin di tích. Vui lòng thử lại sau.</p>
        <Button onClick={() => navigate('/heritages')}>Quay lại danh sách di tích</Button>
      </div>
    )
  }

  if (!data && !isLoading && !isFetching) return null

  return (
    <section className='relative w-full pt-navbar-mobile sm:pt-navbar'>
      {isLoading || isFetching ? (
        <HeritageDetailSkeleton />
      ) : (
        <>
          <Suspense fallback={<HeritageDetailSkeleton />}>
            <HeritageHeader data={data} />
          </Suspense>
          <div className='lcn-container-x py-8'>
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-8'>
              <div className='sm:col-span-2'>
                <Suspense fallback={<div>Đang tải...</div>}>
                  <ErrorBoundary>
                    <HeritageDetailTabs data={data} isAuthenticated={isAuthenticated} navigate={navigate} />
                  </ErrorBoundary>
                </Suspense>
                <div className='mt-10'>
                  <h3 className='lcn-heritage-detail-title mb-4'>Tính năng tương tác</h3>
                  <Suspense fallback={<div>Đang tải...</div>}>
                    <HeritageFeatures handleFeatureClick={handleFeatureClick} />
                  </Suspense>
                </div>
                {!isAuthenticated && (
                  <div className='p-6 bg-heritage-light/30 rounded-md border border-heritage-light text-center mt-6'>
                    <h4 className='text-lg font-medium mb-2'>Đăng nhập để trải nghiệm</h4>
                    <p className='text-sm text-muted-foreground mb-4'>
                      Đăng nhập để sử dụng đầy đủ các tính năng tương tác và cá nhân hóa.
                    </p>
                    <Button onClick={() => navigate('/login')}>Đăng nhập ngay</Button>
                  </div>
                )}
                <div className='mt-10'>
                  <h3 className='lcn-heritage-detail-title mb-4'>Di tích liên quan</h3>
                  <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
                    {getRandomRelatedHeritages.map((item) => (
                      <HeritageCard key={item._id} item={item} />
                    ))}
                  </div>
                </div>
              </div>
              <div className='space-y-8'>
                <Suspense fallback={<div>Đang tải...</div>}>
                  <HeritageInfo data={data} />
                </Suspense>
              </div>
            </div>
          </div>
          {isAuthenticated && !isChatOpen && (
            <Button
              className='fixed bottom-6 right-6 rounded-full w-12 h-12 bg-blue-500 text-white flex items-center justify-center shadow-lg hover:bg-blue-600 z-50'
              onClick={toggleChat}
            >
              <MessageCircle className='w-6 h-6' />
            </Button>
          )}
          {isAuthenticated && isChatOpen && (
            <div className='fixed bottom-6 right-6 w-[300px] bg-white rounded-lg shadow-xl z-50'>
              <div className='flex justify-between items-center p-3 bg-blue-500 text-white rounded-t-lg'>
                <h3 className='text-sm font-medium'>Chat về {data?.name}</h3>
                <Button
                  className='p-1 bg-transparent hover:bg-blue-600'
                  onClick={toggleChat}
                >
                  <X className='w-4 h-4' />
                </Button>
              </div>
              <Suspense fallback={<div>Đang tải...</div>}>
                <HeritageChat
                  heritageId={id}
                  heritageName={data?.name}
                  landmarkData={data}
                  onClose={toggleChat}
                />
              </Suspense>
            </div>
          )}
          <Dialog open={activeFeature === 'leaderboard'} onClose={closeFeatureDialog}>
            <DialogHeader>
              <DialogTitle>Bảng xếp hạng</DialogTitle>
              <DialogDescription>
                Xem thứ hạng của bạn so với những người khác khi khám phá {data?.name}
              </DialogDescription>
            </DialogHeader>
            <div className='py-4'>
              <Suspense fallback={<div>Đang tải...</div>}>
                <LeaderboardTable
                  heritageId={id}
                  heritageName={data?.name}
                  isOpen={activeFeature === 'leaderboard'}
                />
              </Suspense>
            </div>
          </Dialog>
          <Dialog open={activeFeature === 'knowledge-test'} onClose={closeFeatureDialog} className='max-h-[90vh]'>
            <DialogHeader>
              <DialogTitle>Kiểm tra kiến thức</DialogTitle>
              <DialogDescription>Thử thách hiểu biết của bạn về {data?.name}</DialogDescription>
            </DialogHeader>
            <div className='py-4 overflow-auto'>
              <Suspense fallback={<div>Đang tải...</div>}>
                <HeritageKnowledgeTest heritageId={id} heritageName={data?.name} />
              </Suspense>
            </div>
          </Dialog>
        </>
      )}
    </section>
  )
}

export default HeritageDetail
