import { ArrowLeft, Award, Heart, MapPin, Play, Share, Star } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { mockData } from '~/api/mock-data'

import { Button } from '~/components/common/ui/Button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/common/ui/Tabs'
import HeritageCard from '~/components/Heritage/HeritageCard'
import { useGetHeritagesByIdQuery } from '~/store/apis/heritageApi'

const features = [
  { icon: <Award className='h-8 w-8 text-heritage mx-auto mb-2' />, label: 'Bảng xếp hạng' },
  { icon: <Star className='h-8 w-8 text-heritage mx-auto mb-2' />, label: 'Kiểm tra kiến thức' },
  { icon: <Play className='h-8 w-8 text-heritage mx-auto mb-2' />, label: 'Trải nghiệm nhập vai' },
  { icon: <MapPin className='h-8 w-8 text-heritage mx-auto mb-2' />, label: 'Hỏi đáp với trợ lý ảo' },
]

const HeritageDetail = () => {
  const { id } = useParams()
  const { data, isFetching, isLoading } = useGetHeritagesByIdQuery(id)
  const isAuthenticated = false
  const navigate = useNavigate()
  // Fake data
  const heritages = mockData.heritages
  const relatedItems = heritages.filter(item => item._id !== id).slice(0, 3)

  return (
    <section className='relative w-full pt-navbar-mobile sm:pt-navbar'>
      {isLoading || isFetching ? (
        // Skeleton
        <div className='lcn-container-x py-8'>
          <div className='animate-pulse'>
            <div className='h-72 bg-gray-200 rounded-lg mb-8'></div>
            <div className='h-8 w-64 bg-gray-200 rounded mb-4'></div>
            <div className='h-4 bg-gray-200 rounded mb-2'></div>
            <div className='h-4 bg-gray-200 rounded mb-2'></div>
            <div className='h-4 bg-gray-200 rounded mb-8'></div>
          </div>
        </div>
      ) : (
        <>
        {/* Background */}
          <div className='relative overflow-hidden h-[44vh] sm:h-[50vh]'>
            <div className='absolute inset-0'>
              <img
                src={data?.image}
                alt={data?.title}
                className='aspect-video w-full h-full object-cover'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent'></div>
            </div>
            <div className='absolute bottom-0 inset-x-0 lcn-container-x py-8'>
              <Link to='/heritages'>
                <Button
                  variant='ghost'
                  size='sm'
                  className='mb-4 text-primary-foreground hover:bg-primary-foreground/30'
                >
                  <ArrowLeft size={16} />
                  <span>Quay lại danh sách di tích</span>
                </Button>
              </Link>
              <div className='flex flex-wrap items-center justify-between gap-4'>
                {/* Left Background */}
                <div>
                  <div className='flex items-center space-x-2 mb-2'>
                    <span className='px-2 py-1 bg-heritage/90 text-white text-xs rounded-full'>
                      {data?.period}
                    </span>
                    <span className='px-2 py-1 bg-white/20 backdrop-blur-sm text-white text-xs rounded-full'>
                      {data?.location}
                    </span>
                  </div>
                  <h1 className='text-3xl sm:text-4xl font-medium text-white'>
                    {data?.title}
                  </h1>
                  <div className='flex items-center mt-2 text-white'>
                    <Star size={20} className='fill-yellow-400 text-yellow-400 mr-1'/>
                    <span className='font-medium'>5.0</span>
                    <span className='text-white/80 text-sm ml-1'>(120 đánh giá)</span>
                  </div>
                </div>
                {/* Right Background */}
                <div className='flex space-x-2'>
                  {isAuthenticated && (
                    <Button
                      variant='outline'
                      className='backdrop-blur-sm hover:bg-white/30 text-white bg-white/20 border'
                    >
                      <Heart size={16} />
                      <span>Yêu thích</span>
                    </Button>
                  )}
                  <Button
                    variant='outline'
                    className='backdrop-blur-sm hover:bg-white/30 text-white bg-white/20 border'
                  >
                    <Share size={16} />
                    <span>Chia sẻ</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        {/* Content */}
          <div className='lcn-container-x py-8'>
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-8'>
              {/* Left Content */}
              <div className='sm:col-span-2'>
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
                    <p className='text-justify'>{data?.details}</p>
                    <p className='text-justify'>Khi đến thăm {data?.title}, du khách sẽ được chiêm ngưỡng những công trình kiến trúc 
                    độc đáo, tìm hiểu về lịch sử hình thành và phát triển của di tích, cũng như khám phá 
                    những câu chuyện thú vị liên quan đến di tích này.</p>
                  </TabsContent>
                  {/* History Tab */}
                  <TabsContent value='history' className='space-y-6'>
                    <h3 className='lcn-heritage-detail-title'>Lịch sử</h3>
                    <p className='text-justify'>{data?.significance}</p>
                    <div className='w-full h-[1px] bg-border'></div>
                    <h3 className='lcn-heritage-detail-title'>Các sự kiện lịch sử</h3>
                    <ul className='space-y-2'>
                      {
                        data?.facts?.map((fact, index) => (
                          <li className='flex text-justify' key={index}>
                            <span className='h-5 w-5 rounded-full bg-heritage-light text-heritage-dark
                              flex items-center justify-center text-xs mr-2 mt-0.5'>
                              {index + 1}
                            </span>
                            <span>{fact}</span>
                          </li>
                        ))
                      }
                    </ul>
                  </TabsContent>
                  {/* Gallery Tab */}
                  <TabsContent value='gallery' className='space-y-6'>
                    <h3 className='lcn-heritage-detail-title'>Hình ảnh</h3>
                    <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                      <div className='overflow-hidden rounded-md aspect-4/3'>
                         <img src={data?.image} alt={data?.title} className='w-full h-full object-cover hover:scale-105 transition-transform duration-300' />
                      </div>
                    </div>
                  </TabsContent>
                  {/* Review Tab */}
                  <TabsContent value='review' className='space-y-6'>
                    <h3 className='lcn-heritage-detail-title'>Đánh giá</h3>
                    <div className='flex items-center'>
                      <div className='text-3xl font-bold mr-2'>4.8</div>
                      <div className='flex flex-col'>
                        <div className='flex'>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} size={16} className={`${star <= 4.8 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                          ))}
                        </div>
                        <span className='text-sm text-muted-foreground'>120 đánh giá</span>
                      </div>
                    </div>
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
                                <Star key={star} size={16} className={`${star <= 4.8 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                              ))}
                            </div>
                          </div>
                          <p className='text-sm text-justify'>{data.title} là một địa điểm tuyệt vời để tìm hiểu về lịch 
                            sử và văn hóa. Kiến trúc ấn tượng và bầu không khí thanh bình. Đáng để ghé thăm!
                          </p>    
                        </div>
                      ))}
                    </div>
                    {isAuthenticated ? (
                      <div className='flex justify-center'><Button>Viết đánh giá</Button></div>
                    ) : (
                      <div className='p-4 bg-heritage-light/20 rounded-md border border-heritage-light text-center'>
                        <p className='text-sm mb-3'>Đăng nhập để viết đánh giá về trải nghiệm của bạn</p>
                        <Button onClick={() => navigate('/login')}>Đăng nhập</Button>
                      </div>
                  )}
                  </TabsContent>
                </Tabs>
                {/* Features */}
                <div className='mt-10'>
                  <h3 className='lcn-heritage-detail-title mb-4'>Tính năng tương tác</h3>
                  <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
                    {features.map((feature, index) => (
                      <div
                        key={index}
                        className='p-4 border bg-heritage-light/20 rounded-md border-heritage-light 
                        text-center hover:bg-heritage-light/30 transition-colors duration-200'
                      >
                        {feature.icon}
                        <p className='text-sm font-medium'>{feature.label}</p>
                      </div>
                    ))}
                  </div>
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
                <div className='border rounded-lg p-6'>
                  <h3 className='lcn-heritage-detail-title mb-4'>Thông tin chi tiết</h3>
                  <dl className='space-y-4'>
                    <div>
                      <dt className='text-sm text-muted-foreground'>Thời kỳ</dt>
                      <dd className='font-medium'>{data?.period}</dd>
                    </div>
                    <div>
                      <dt className='text-sm text-muted-foreground'>Địa chỉ</dt>
                      <dd className='font-medium'>{data?.location}</dd>
                    </div>
                    <div>
                      <dt className='text-sm text-muted-foreground'>Giờ mở cửa</dt>
                      <dd className='font-medium'>09:00 - 18:00 hàng ngày</dd>
                    </div>
                    <div>
                      <dt className='text-sm text-muted-foreground'>Danh hiệu</dt>
                      <dd className='font-medium'>Di tích quốc gia</dd>
                    </div>
                    <div>
                      <dt className='text-sm text-muted-foreground'>Năm xây dựng</dt>
                      <dd className='font-medium'>{data?.period}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  )
}

export default HeritageDetail
