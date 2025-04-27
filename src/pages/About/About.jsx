import { Map, MessageSquare, Rocket, Telescope, UserPlus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { lazy, Suspense, useCallback, useEffect, useState } from 'react'

import { Button } from '~/components/common/ui/Button'
import SectionContainer from './SectionContainer'
import SideNavigation from './SideNavigation'
import Title from '~/components/common/Title'
import VisionItem from './components/VisionItem'
import SectionHeader from './components/SectionHeader'

const TeamMembers = lazy(() => import('./TeamMembers'))
const ContactInfo = lazy(() => import('./ContactInfo'))
const CoreValues = lazy(() => import('./CoreValues'))
const Timeline = lazy(() => import('./Timeline'))

const About = () => {
  const [activeSection, setActiveSection] = useState('vision')

  // Handle scroll-based section activation
  const handleScroll = useCallback(() => {
    const sections = ['vision', 'story', 'values', 'team', 'contact']
    
    // Find the section currently in view
    const current = sections.find(section => {
      const element = document.getElementById(section)
      if (!element) return false
      
      const rect = element.getBoundingClientRect()
      return rect.top <= 150 && rect.bottom >= 150
    })
    
    if (current) {
      setActiveSection(current)
    }
  }, [])
  
  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  return (
    <section>
      <SideNavigation activeSection={activeSection} setActiveSection={setActiveSection} />

      <main className='relative w-full bg-secondary/50'>
        {/* Vision & Mission */}
        <SectionContainer id='vision' className='py-24'>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-16 items-center'>
            <div className='z-10 aspect-square rounded-2xl overflow-hidden shadow-sm order-2 sm:order-1'>
              <img
                src='/images/vision-banner.png'
                alt='Tầm nhìn và sứ mệnh'
                className='object-cover brightness-90 w-full h-full'
                loading='lazy'
                width='600'
                height='600'
              />
            </div>
            <div className='max-w-3xl mx-auto text-justify order-1 sm:order-2'>
              <div className='text-center'>
                <div className='inline-block px-5 py-2 bg-heritage/90 text-white rounded-full font-medium mb-4 '>
                  Tầm nhìn & Sứ mệnh
                </div>
              </div>
              <div className='text-center'>
                <Title title='Kết nối quá khứ với hiện tại' className='text-3xl sm:text-4xl mb-6' />
              </div>
              <p className='text-lg mb-8 leading-relaxed'>
                Dự án Heritage ra đời với sứ mệnh bảo tồn, phát huy và lan tỏa giá trị văn hóa, lịch sử
                của dân tộc đến với cộng đồng, đặc biệt là thế hệ trẻ thông qua nền tảng công nghệ hiện đại.
              </p>
              <div className='space-y-6'>
                <VisionItem
                  icon={<Telescope className='text-heritage-dark' />}
                  title='Tầm nhìn'
                  description='Trở thành nền tảng hàng đầu về bảo tồn và phát huy giá trị di sản văn hóa Việt Nam, kết nối mọi người với lịch sử dân tộc qua công nghệ hiện đại.'
                />
                <VisionItem
                  icon={<Rocket className='text-heritage-dark' />}
                  title='Sứ mệnh'
                  description='Sử dụng công nghệ để bảo tồn, lan tỏa và giáo dục về di sản văn hóa Việt Nam, tạo ra trải nghiệm tương tác và hấp dẫn cho người dùng.'
                />
              </div>
            </div>
          </div>
        </SectionContainer>

        {/* Our Story - Timeline */}
        <SectionContainer id='story' className='py-24 bg-primary/5'>
          <SectionHeader
            eyebrow='Câu chuyện của chúng tôi'
            title='Hành trình phát triển'
            description='Từ ý tưởng đến hiện thực, hành trình của chúng tôi là minh chứng cho niềm đam mê với di sản văn hóa và công nghệ.'
          />  
          <Suspense fallback={<div className='h-96 flex items-center justify-center'>Đang tải...</div>}>
            <Timeline />
          </Suspense>
          
        </SectionContainer>

        {/* Core Values */}
        <SectionContainer id='values' className='py-24'>
          <SectionHeader 
            eyebrow='Giá trị cốt lõi'
            title='Những giá trị chúng tôi theo đuổi'
            description='Những nguyên tắc và giá trị định hướng mọi hoạt động của chúng tôi trong hành trình bảo tồn di sản văn hóa.'
          />
          <Suspense fallback={<div className='h-96 flex items-center justify-center'>Đang tải...</div>}>
            <CoreValues />
          </Suspense>
        </SectionContainer>

        {/* Team */}
        <SectionContainer id='team' className='py-24 bg-secondary/50'>
          <SectionHeader 
            eyebrow='Đội ngũ'
            title='Những con người tài năng'
            description='Gặp gỡ những con người đam mê và tài năng đứng sau dự án Heritage.'
          />
          <Suspense fallback={<div className='h-96 flex items-center justify-center'>Đang tải...</div>}>
            <TeamMembers />
          </Suspense>
        </SectionContainer>

        {/* Call to Action */}
        <section className='py-24 bg-heritage/85 text-white'>
          <div className='lcn-container-x text-center'>
            <Title title='Tham gia cùng chúng tôi' className='text-3xl sm:text-4xl mb-6 text-white' />
            <p className='text-xl mb-8'>Hãy trở thành một phần của hành trình bảo tồn và phát huy giá trị di sản văn hóa Việt Nam.</p>
            <div className='flex flex-wrap justify-center gap-4'>
              <Link to='/register'>
                <Button
                  variant='outline'
                  size='lg'
                  className='w-52 text-muted-foreground backdrop-blur-sm border-white hover:bg-white/20 hover:text-white'
                >
                  <UserPlus className='mr-2' size={20} />
                  Đăng ký ngay
                </Button>
              </Link>
              <Link to='/explore'>
                <Button 
                  size='lg'
                  variant='outline'
                  className='bg-white/10 backdrop-blur-sm text-white border-white hover:bg-white/20 w-62'
                >
                  <Map className='mr-2' size={20} />
                  Khám phá bản đồ
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Contact */}
        <SectionContainer id='contact' className='py-24 bg-secondary/50'>
          <SectionHeader 
            eyebrow='Liên hệ'
            title='Kết nối với chúng tôi'
            description='Chúng tôi luôn sẵn sàng lắng nghe ý kiến đóng góp và giải đáp thắc mắc của bạn. Hãy liên hệ với chúng tôi qua các kênh sau:'
          />
          <Suspense fallback={<div className='h-96 flex items-center justify-center'>Đang tải...</div>}>
            <ContactInfo />
          </Suspense>
        </SectionContainer>
      </main>
    </section>
  )
}

export default About
