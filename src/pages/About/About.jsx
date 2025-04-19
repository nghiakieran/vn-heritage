import { MessageSquare, Rocket, Telescope, UserPlus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState } from 'react'

import { Button } from '~/components/common/ui/Button'
import SectionContainer from './SectionContainer'
import SideNavigation from './SideNavigation'
import TeamMembers from './TeamMembers'
import ContactInfo from './ContactInfo'
import CoreValues from './CoreValues'
import Timeline from './Timeline'
import Title from '~/components/common/Title'

const About = () => {
  const [activeSection, setActiveSection] = useState('vision')

  return (
    <section>
      <SideNavigation activeSection={activeSection} setActiveSection={setActiveSection} />

      <main className='relative w-full bg-secondary/50'>
        {/* Vision & Mission */}
        <SectionContainer id='vision' className='py-24'>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-16 items-center'>
            <div className='z-10 aspect-square rounded-2xl overflow-hidden shadow-sm'>
              <img src='/images/visionBanner.png' alt='Tầm nhìn và sứ mệnh' className='object-cover brightness-90' loading='lazy'/>
            </div>
            <div className='max-w-3xl mx-auto text-justify'>
              <div className='text-center'>
                <div className='inline-block px-5 py-2 bg-heritage/90 text-white rounded-full font-medium mb-4 '>
                  Tầm nhìn & Sứ mệnh
                </div>
              </div>
              <div className='text-center'>
                <Title title={'Kết nối quá khứ với hiện tại'} className={'text-3xl sm:text-4xl mb-6'} />
              </div>
              <p className='text-lg mb-8 leading-relaxed'>
                Dự án Heritage ra đời với sứ mệnh bảo tồn, phát huy và lan tỏa giá trị văn hóa, lịch sử
                của dân tộc đến với cộng đồng, đặc biệt là thế hệ trẻ thông qua nền tảng công nghệ hiện đại.
              </p>
              <div className='space-y-6'>
                <div className='flex'>
                  <div className='flex-shrink-0 h-12 w-12 rounded-full bg-heritage-light flex items-center justify-center mr-4'>
                    <Telescope className='text-heritage-dark' />
                  </div>
                  <div>
                    <h3 className='text-xl mb-2 font-bold text-heritage-dark'>Tầm nhìn</h3>
                    <p>Trở thành nền tảng hàng đầu về bảo tồn và phát huy giá trị di sản văn hóa Việt Nam, kết nối mọi người với lịch sử dân tộc qua công nghệ hiện đại.</p>
                  </div>
                </div>
                <div className='flex'>
                  <div className='flex-shrink-0 w-12 h-12 rounded-full bg-heritage-light flex items-center justify-center mr-4'>
                   <Rocket className='text-heritage-dark' />
                  </div>
                  <div>
                    <h3 className='text-xl mb-2 font-bold text-heritage-dark'>Sứ mệnh</h3>
                    <p>Sử dụng công nghệ để bảo tồn, lan tỏa và giáo dục về di sản văn hóa Việt Nam, tạo ra trải nghiệm tương tác và hấp dẫn cho người dùng.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SectionContainer>

        {/* Our Story - Timeline */}
        <SectionContainer id='story' className='py-24 bg-primary/5'>
          <div className='text-center mb-16'>
            <div className='inline-block px-5 py-2 bg-heritage/90 text-white rounded-full font-medium mb-4'>
              Câu chuyện của chúng tôi
            </div>
            <div>
              <Title title={'Hành trình phát triển'} className={'text-3xl sm:text-4xl mb-6'} />
            </div>
            <p className='text-lg text-center'>Từ ý tưởng đến hiện thực, hành trình của chúng tôi là minh chứng cho niềm đam mê với di sản văn hóa và công nghệ.</p>
          </div>

          <Timeline />
        </SectionContainer>

        {/* Core Values */}
        <SectionContainer id='values' className='py-24'>
          <div className='text-center mb-16'>
            <div className='inline-block px-5 py-2 bg-heritage/90 text-white rounded-full font-medium mb-4'>
              Giá trị cốt lõi
            </div>
            <div>
              <Title title={'Những giá trị chúng tôi theo đuổi'} className={'text-3xl sm:text-4xl mb-6'} />
            </div>
            <p className='text-lg'>Những nguyên tắc và giá trị định hướng mọi hoạt động của chúng tôi trong hành trình bảo tồn di sản văn hóa.</p>
          </div>

          <CoreValues />
        </SectionContainer>

        {/* Team */}
        <SectionContainer id='team' className='py-24 bg-secondary/50'>
          <div className='text-center mb-16'>
            <div className='inline-block px-5 py-2 bg-heritage/90 text-white rounded-full font-medium mb-4'>
              Đội ngũ
            </div>
            <div>
              <Title title={'Những con người tài năng'} className={'text-3xl sm:text-4xl mb-6'} />
            </div>
            <p className='text-lg'>Gặp gỡ những con người đam mê và tài năng đứng sau dự án Heritage.</p>
          </div>

          <TeamMembers />
        </SectionContainer>

        {/* Call to Action */}
        <section className='py-24 bg-heritage/85 text-white'>
          <div className='lcn-container-x text-center'>
            <Title title={'Tham gia cùng chúng tôi'} className={'text-3xl sm:text-4xl mb-6 text-white'} />
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
              <Link to='/chatbot'>
                <Button 
                  size='lg'
                  variant='outline'
                  className='bg-white/10 backdrop-blur-sm text-white border-white hover:bg-white/20 w-52'
                >
                  <MessageSquare className='mr-2' size={20} />
                  Trợ lý AI
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Contact */}
        <SectionContainer id='contact' className='py-24 bg-secondary/50'>
          <div className='text-center'>
            <div className='inline-block px-5 py-2 bg-heritage/90 text-white rounded-full font-medium mb-4'>
              Liên hệ
            </div>
            <div>
              <Title title={'Kết nối với chúng tôi'} className={'text-3xl sm:text-4xl mb-6'} />
            </div>
            <p className='text-lg mb-8'>Chúng tôi luôn sẵn sàng lắng nghe ý kiến đóng góp và giải đáp thắc mắc của bạn. Hãy liên hệ với chúng tôi qua các kênh sau:</p>
          </div>
          
          <ContactInfo />
        </SectionContainer>
      </main>
    </section>
  )
}

export default About
