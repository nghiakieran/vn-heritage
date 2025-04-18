import { Star } from 'lucide-react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/common/ui/Tabs'
import { Button } from '~/components/common/ui/Button'
import HistoryTab from './tabs/HistoryTab'
import GalleryTab from './tabs/GalleryTab'

const HeritageDetailTabs = ({ data, isAuthenticated, navigate }) => {

  const hasReviews = data?.stats?.totalReviews > 0
  const averageRating = data?.stats?.averageRating || 0.0

  return (
    <Tabs defaultValue='overview'>
      <TabsList>
        <TabsTrigger value='overview'>Tổng quan</TabsTrigger>
        <TabsTrigger value='history'>Lịch sử</TabsTrigger>
        <TabsTrigger value='gallery'>Hình ảnh</TabsTrigger>
        <TabsTrigger value='review'>Đánh giá</TabsTrigger>
      </TabsList>

      {/* Overview Tab */}
      <TabsContent value='overview' className='space-y-6'>
        <h3 className='lcn-heritage-detail-title'>Giới thiệu</h3>
        <p className='text-justify'>{data?.description}</p>
        <p className='text-justify'>
          Khi đến thăm {data?.name}, du khách sẽ được chiêm ngưỡng những công trình kiến trúc độc đáo, tìm hiểu về lịch
          sử hình thành và phát triển của di tích, cũng như khám phá những câu chuyện thú vị liên quan đến di tích này.
        </p>
      </TabsContent>

      {/* History Tab */}
      <TabsContent value='history' className='space-y-6'>
        <h3 className='lcn-heritage-detail-title'>Các sự kiện lịch sử</h3>
        <HistoryTab historicalEvents={data?.additionalInfo?.historicalEvents} />
      </TabsContent>

      {/* Gallery Tab */}
      <TabsContent value='gallery' className='space-y-6'>
        <h3 className='lcn-heritage-detail-title'>Hình ảnh</h3>
        <GalleryTab images={data?.images} name={data?.name} />
      </TabsContent>

      {/* Review Tab */}
      <TabsContent value='review' className='space-y-6'>
        <h3 className='lcn-heritage-detail-title'>Đánh giá</h3>
        <div className='flex items-center'>
          <div className='text-3xl font-bold mr-2'>{averageRating}</div>
          <div className='flex flex-col'>
            <div className='flex'>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={16}
                  className={`${star <= averageRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <span className='text-sm text-muted-foreground'>{data?.stats?.totalReviews || 0} đánh giá</span>
          </div>
        </div>

        {hasReviews ? (
          <div className='space-y-6'>
            {[1, 2, 3].map((review) => (
              <div key={review} className='border-b pb-6'>
                <div className='flex justify-between mb-2'>
                  <div className='flex items-center'>
                    <div className='w-10 h-10 mr-3 rounded-full bg-heritage-light text-heritage-dark flex items-center justify-center font-medium'>
                      {String.fromCharCode(64 + review)}
                    </div>
                    <div>
                      <div className='font-medium'>Khách tham quan {review}</div>
                      <div className='text-sm text-muted-foreground'>Đã ghé thăm tháng {review}/2025</div>
                    </div>
                  </div>
                  <div className='flex'>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={16}
                        className={`${star <= averageRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                </div>
                <p className='text-sm text-justify'>
                  {data.name} là một địa điểm tuyệt vời để tìm hiểu về lịch sử và văn hóa. Kiến trúc ấn tượng và bầu
                  không khí thanh bình. Đáng để ghé thăm!
                </p>
              </div>
            ))}
          </div>
        ) : isAuthenticated ? (
          <div className='text-center py-12 border border-dashed rounded-lg'>
            <Star size={40} className='mx-auto text-muted-foreground mb-4 opacity-50' />
            <p className='text-muted-foreground'>Chưa có đánh giá nào cho di tích này.</p>
            {isAuthenticated && <Button className='mt-4'>Viết đánh giá đầu tiên</Button>}
          </div>
        ) : (
          <div className='p-4 bg-heritage-light/20 rounded-md border border-heritage-light text-center'>
            <p className='text-sm mb-3'>Đăng nhập để viết đánh giá về trải nghiệm của bạn</p>
            <Button onClick={() => navigate('/login')}>Đăng nhập</Button>
          </div>
        )}
      </TabsContent>
    </Tabs>
  )
}

export default HeritageDetailTabs
