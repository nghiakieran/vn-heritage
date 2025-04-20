import { useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'

import { useGetHeritagesByIdQuery } from '~/store/apis/heritageApi'
import HeritageCard from '~/components/Heritage/HeritageCard'
import HeritageDetailSkeleton from './HeritageDetailSkeleton'
import HeritageDetailTabs from './HeritageDetailTab'
import HeritageFeatures from './HeritageFeatures'
import HeritageHeader from './HeritageHeader'
import HeritageInfo from './HeritageInfo'
import { mockData } from '~/api/mock-data'
import { Button } from '~/components/common/ui/Button'
import { Dialog, DialogDescription, DialogHeader, DialogTitle } from '~/components/common/ui/Dialog'
import LeaderboardTable from './LeaderboardTable/LeaderboardTable'

const HeritageDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data, isFetching, isLoading, isError } = useGetHeritagesByIdQuery(id)

  const isAuthenticated = true
  // Fake data
  const heritages = mockData.heritages
  const relatedItems = heritages.filter(item => item._id !== id).slice(0, 3)

  const [activeFeature, setActiveFeature] = useState(null)
  
  const handleFeatureClick = (feature) => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    setActiveFeature(feature)
  }
  
  const closeFeatureDialog = () => {
    setActiveFeature(null)
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
          <HeritageHeader data={data} isAuthenticated={isAuthenticated} />
          {/* Content */}
          <div className='lcn-container-x py-8'>
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-8'>
              {/* Left Content */}
              <div className='sm:col-span-2'>
                <HeritageDetailTabs data={data} isAuthenticated={isAuthenticated} navigate={navigate} />
                {/* Features */}
                <div className='mt-10'>
                  <h3 className='lcn-heritage-detail-title mb-4'>Tính năng tương tác</h3>
                  <HeritageFeatures handleFeatureClick={handleFeatureClick} />
                </div>
                {/* Authenticated */}
                  {
                    !isAuthenticated && (
                      <div className='p-6 bg-heritage-light/30 rounded-md border border-heritage-light text-center mt-6'>
                        <h4 className='text-lg font-medium mb-2'>Đăng nhập để trải nghiệm</h4>
                        <p className='text-sm text-muted-foreground mb-4'>Đăng nhập để sử dụng đầy đủ các tính năng tương tác và cá nhân hóa.</p>
                        <Button onClick={() => navigate('/login')}>Đăng nhập ngay</Button>
                      </div>
                    )
                  }
                {/* Related Item */}
                <div className='mt-10'>
                  <h3 className='lcn-heritage-detail-title mb-4'>Di tích liên quan</h3>
                  <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
                    { relatedItems.map(item => ( <HeritageCard key={item._id} item={item}/> )) }
                  </div>
                </div>
              </div>
              {/* Right Content */}
              <div className='space-y-8'>
                <HeritageInfo data={data} />
              </div>
            </div>
          </div>
          {/* Dialog */}
          <Dialog open={activeFeature === 'leaderboard'} onClose={closeFeatureDialog}>
            <DialogHeader>
              <DialogTitle>Bảng xếp hạng</DialogTitle>
              <DialogDescription>
                Xem thứ hạng của bạn so với những người khác khi khám phá {data?.name}
              </DialogDescription>
            </DialogHeader>
            <div className='py-4'>
              <LeaderboardTable heritageId={id} heritageName={data?.name}/>
            </div>
          </Dialog>
        </>
      )}
    </section>
  )
}

export default HeritageDetail
