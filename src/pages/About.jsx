import { Facebook, Instagram, Linkedin, Mail, MessageSquare, MessagesSquare, Phone, Rocket, Telescope, UserPlus } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import Title from '~/components/common/Title'
import { Button } from '~/components/common/ui/Button'


const About = () => {
  const [activeSection, setActiveSection] = useState('vision')

  return (
    <section>
      {/* Sticky Side Navigation */}
      <div className='hidden sm:block fixed left-8 top-1/2 transform -translate-y-1/2 z-30'>
        <div className='bg-white/80 backdrop-blur-sm rounded-full py-6 px-3 shadow-sm'>
          <nav className='flex flex-col items-center space-y-8'>
            {[
              { id: 'vision', icon: '🔭', label: 'Tầm nhìn' },
              { id: 'story', icon: '📚', label: 'Câu chuyện' },
              { id: 'values', icon: '💎', label: 'Giá trị cốt lõi' },
              { id: 'team', icon: '👥', label: 'Đội ngũ' },
            ].map((item) => (
              <Button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id)
                  document.getElementById(item.id).scrollIntoView({ behavior: 'smooth' })
                }}
                variant='ghost'
                size='icon'
                className={`group relative !rounded-full ${
                  activeSection === item.id ? 'bg-muted-foreground/70' : 'hover:bg-heritage-primary/70'
                }`}
                aria-label={item.label}
              >
                <span className='text-xl'>{item.icon}</span>
                <span className='absolute left-full ml-4 px-2 py-1 rounded bg-muted-foreground/70 text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity'>
                  {item.label}
                </span>
              </Button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className='relative w-full bg-secondary/50'>
        {/* Vision & Mission */}
        <section id='vision' className='py-24'>
          <div className='lcn-container-x'>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-16 items-center'>
              <div className='z-10 aspect-square rounded-2xl overflow-hidden shadow-sm'>
                <img src='/images/visionBanner.png' alt='Tầm nhìn và sứ mệnh' className='object-cover brightness-90' loading='lazy'/>
              </div>
              <div className='max-w-3xl mx-auto text-justify'>
                <div className='text-center'><div className='inline-block px-5 py-2 bg-heritage/90 text-white rounded-full font-medium mb-4 '>Tầm nhìn & Sứ mệnh</div></div>
                <div className='text-center'><Title title={'Kết nối quá khứ với hiện tại'} className={'text-3xl sm:text-4xl mb-6'} /></div>
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
          </div>
        </section>

        {/* Our Story - Timeline */}
        <section id='story' className='py-24 bg-primary/5'>
          <div className='lcn-container-x'>
            <div className='text-center mb-16'>
              <div className='inline-block px-5 py-2 bg-heritage/90 text-white rounded-full font-medium mb-4'>Câu chuyện của chúng tôi</div>
              <div><Title title={'Hành trình phát triển'} className={'text-3xl sm:text-4xl mb-6'} /></div>
              <p className='text-lg text-center'>Từ ý tưởng đến hiện thực, hành trình của chúng tôi là minh chứng cho niềm đam mê với di sản văn hóa và công nghệ.</p>
            </div>

            <div className='relative'>
              {/* Timeline Line */}
              <div className='absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-primary/10'></div>

              {/* Timeline Items */}
              <div className='space-y-24'>
                {[
                  {
                    year: '01/2025',
                    title: 'Khởi nguồn ý tưởng',
                    description:
                      'Ý tưởng về một nền tảng kết hợp công nghệ và di sản văn hóa được hình thành, với mục tiêu tạo ra trải nghiệm mới mẻ cho người dùng khi tìm hiểu về di tích lịch sử.',
                    img: '/images/idea-inception.svg',
                  },
                  {
                    year: '02/2025',
                    title: 'Nghiên cứu và phát triển',
                    description:
                      'Giai đoạn nghiên cứu chuyên sâu về các di tích lịch sử Việt Nam, đồng thời phát triển các công nghệ tương tác để tạo trải nghiệm người dùng tốt nhất.',
                    img: '/images/idea-inception.svg',
                  },
                  {
                    year: '03/2025',
                    title: 'Ra mắt phiên bản thử nghiệm',
                    description:
                      'Phiên bản beta của nền tảng được ra mắt với các tính năng cơ bản, nhận được nhiều phản hồi tích cực từ cộng đồng.',
                    img: '/images/idea-inception.svg',
                  },
                  {
                    year: '04/2025',
                    title: 'Mở rộng và phát triển',
                    description:
                      'Nền tảng được phát triển toàn diện với nhiều tính năng mới như trải nghiệm nhập vai, bản đồ tương tác, trợ lý ảo và cộng đồng người dùng ngày càng mở rộng.',
                    img: '/images/idea-inception.svg'
                  },
                ].map((item, index) => (
                  <div key={index} className='relative'>
                    {/* Timeline Dot */}
                    <div className='absolute left-1/2 transform -translate-x-1/2 -mt-4 w-8 h-8 rounded-full bg-primary border-4 border-white z-10'></div>

                    <div className={`flex flex-col ${index % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'} gap-8`}>
                      <div className={`sm:w-1/2 p-6  ${index % 2 === 0 ? 'pl-0 ' : 'pr-0'}`} >
                        <div className={`${ index % 2 === 0 ? 'sm:text-right' : 'sm:text-left' }`}>
                          <Title title={item.year} className={'text-3xl sm:text-4xl mb-4'} />
                          <h3 className='text-2xl font-bold mb-4 text-heritage-dark'>{item.title}</h3>
                          <p className='text-justify'>{item.description}</p>
                        </div>
                      </div>
                      <div className={`sm:w-1/2 p-6 ${index % 2 === 0 ? 'pr-0 ' : 'pl-0'}`} >
                        <div className='rounded-xl overflow-hidden shadow-sm transform transition-transform'>
                          <div className='aspect-video'>
                            <img src={item.img || 'https://placehold.co/600x400'} alt={item.title} className='object-cover' loading='lazy' />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section id='values' className='py-24'>
          <div className='lcn-container-x'>
            <div className='text-center mb-16'>
              <div className='inline-block px-5 py-2 bg-heritage/90 text-white rounded-full font-medium mb-4'>Giá trị cốt lõi</div>
              <div><Title title={'Những giá trị chúng tôi theo đuổi'} className={'text-3xl sm:text-4xl mb-6'} /></div>
              <p className='text-lg '>Những nguyên tắc và giá trị định hướng mọi hoạt động của chúng tôi trong hành trình bảo tồn di sản văn hóa.</p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
              {[
                {
                  icon: '🔍',
                  title: 'Chính xác',
                  description:
                    'Cam kết cung cấp thông tin chính xác, đáng tin cậy và được nghiên cứu kỹ lưỡng về di sản văn hóa.',
                },
                {
                  icon: '🌱',
                  title: 'Bảo tồn',
                  description: 'Đặt sự bảo tồn và tôn trọng giá trị di sản văn hóa lên hàng đầu trong mọi hoạt động.',
                },
                {
                  icon: '🔄',
                  title: 'Đổi mới',
                  description:
                    'Không ngừng đổi mới và áp dụng công nghệ tiên tiến để tạo ra trải nghiệm học tập hấp dẫn.',
                },
                {
                  icon: '🤝',
                  title: 'Hợp tác',
                  description:
                    'Xây dựng mối quan hệ hợp tác với các chuyên gia, tổ chức và cộng đồng để phát triển nền tảng.',
                },
                {
                  icon: '🌍',
                  title: 'Tiếp cận',
                  description:
                    'Cam kết tạo ra nền tảng dễ tiếp cận cho mọi đối tượng, không phân biệt tuổi tác hay nền tảng.',
                },
                {
                  icon: '💡',
                  title: 'Giáo dục',
                  description:
                    'Lấy giáo dục làm trọng tâm, truyền cảm hứng cho thế hệ trẻ về giá trị di sản văn hóa dân tộc.',
                },
              ].map((value, index) => (
                <div key={index} className='bg-white border rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow'>
                  <div className='text-4xl mb-4 text-center'>{value.icon}</div>
                  <h3 className='text-xl font-bold mb-3 text-center text-heritage-dark'>{value.title}</h3>
                  <p className='text-justify'>{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section id='team' className='py-24 bg-primary/5'>
          <div className='lcn-container-x'>
            <div className='text-center mb-16'>
              <div className='inline-block px-5 py-2 bg-heritage/90 text-white rounded-full font-medium mb-4'>Đội ngũ</div>
              <div><Title title={'Những con người tài năng'} className={'text-3xl sm:text-4xl mb-6'} /></div>
              <p className='text-lg'>Gặp gỡ những con người đam mê và tài năng đứng sau dự án Heritage.</p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16'>
              {[
                {
                  name: 'Nguyễn An Thành Phát',
                  role: 'Founder & Leader',
                  bio: 'Với hơn 3 năm kinh nghiệm trong lĩnh vực phát triển website.',
                  img: '/images/profile.jpg',
                },
                {
                  name: 'Lê Quốc Nam',
                  role: 'Backend Developer',
                  bio: 'Chuyên gia công nghệ với kinh nghiệm phát triển backend với các nền tảng tương tác và ứng dụng AI vào sản phẩm.',
                  img: '/images/profile.jpg',
                },
                {
                  name: 'Phan Văn Thuận',
                  role: 'Backend Developer',
                  bio: 'Nhà nghiên cứu công nghệ với kinh nghiệm thiết kế database mạnh mẽ, sử dụng các công nghệ hiện đại.',
                  img: '/images/profile.jpg',
                },
                {
                  name: 'Lê Chí Nghĩa',
                  role: 'Frontend Developer',
                  bio: 'Nhà thiết kế với niềm đam mê tạo ra trải nghiệm người dùng trực quan và hấp dẫn.',
                  img: '/images/profile.jpg',
                },
                {
                  name: 'Nguyễn Thanh Hùng',
                  role: 'AI Specialist',
                  bio: 'Chuyên gia AI với kinh nghiệm phát triển các hệ thống trợ lý ảo thông minh.',
                  img: '/images/profile.jpg',
                },

              ].map((member, index) => (
                <div key={index} className='group text-center'>
                  <div className='relative mb-6 overflow-hidden rounded-xl aspect-square text-left'>
                    <img
                      src={member.img || 'https://placehold.co/600x400'}
                      alt={member.name}
                      className='object-cover transition-transform duration-500 group-hover:scale-110'
                      loading='lazy'
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6'>
                      <div className='text-white'>
                        <p className='font-medium'>{member.bio}</p>
                        <div className='flex space-x-3 mt-4'>
                          <Link to='https://www.facebook.com/le.chi.nghia.621880/' className='text-white hover:text-heritage-light'><Facebook size={20} /></Link>
                          <Link to='https://www.linkedin.com/in/nghia-le-1b3bb32b8/' className='text-white hover:text-heritage-light'><Linkedin size={20} /></Link>
                        </div>
                      </div>
                    </div>
                  </div>
                  <h3 className='text-xl font-bold text-heritage-dark'>{member.name}</h3>
                  <p className='text-primary'>{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

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
                  className='w-52 text-muted-foreground backdrop-blur-sm border-white hover:bg-white/20 hover:text-white'>
                  <UserPlus className='mr-2' size={20} />
                  Đăng ký ngay
                </Button>
              </Link>
              <Link to='/chatbot'>
                <Button 
                  size='lg'
                  variant='outline'
                  className='bg-white/10 backdrop-blur-sm text-white border-white hover:bg-white/20 w-52'>
                  <MessageSquare className='mr-2' size={20} />
                  Trợ lý AI
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className='py-24 bg-secondary/50'>
          <div className='lcn-container-x'>
            <div className='text-center'>
              <div className='inline-block px-5 py-2 bg-heritage/90 text-white rounded-full font-medium mb-4'>Liên hệ</div>
              <div><Title title={'Kết nối với chúng tôi'} className={'text-3xl sm:text-4xl mb-6'} /></div>
              <p className='text-lg mb-8'>Chúng tôi luôn sẵn sàng lắng nghe ý kiến đóng góp và giải đáp thắc mắc của bạn. Hãy liên hệ với chúng tôi qua các kênh sau:</p>
            </div>
            <div className='flex-col items-center justify-center'>
              <div className='flex items-center justify-center p-4 gap-4'>
                <div className='flex flex-col space-y-6'>
                  <div className='flex space-x-6 items-center'>
                    <div className='flex-shrink-0 w-12 h-12 rounded-full bg-heritage-light flex items-center justify-center'>
                      <Mail className='text-heritage-dark' />
                    </div>
                    <div>
                      <h3 className='text-xl font-bold mb-1 text-heritage-dark'>Email</h3>
                      <p>lechinghia202@gmail.com</p>
                    </div>
                  </div>
                  <div className='flex space-x-6 items-center'>
                    <div className='flex-shrink-0 w-12 h-12 rounded-full bg-heritage-light flex items-center justify-center'>
                      <Phone className='text-heritage-dark' />
                    </div>
                    <div>
                      <h3 className='text-xl font-bold mb-1 text-heritage-dark'>Điện thoại</h3>
                      <p>0946064930</p>
                    </div>
                  </div>
                  <div className='flex space-x-6 items-center'>
                    <div className='flex-shrink-0 w-12 h-12 rounded-full bg-heritage-light flex items-center justify-center'>
                      <MessagesSquare className='text-heritage-dark' />
                    </div>
                    <div>
                      <h3 className='text-xl font-bold mb-1 text-heritage-dark'>Mạng xã hội</h3>
                      <p>Lê Chí Nghĩa</p>
                    </div>
                  </div>
                </div>                
              </div>

              <div className='flex space-x-4 items-center justify-center mt-8'>
                <Link
                  to='https://www.facebook.com/le.chi.nghia.621880/'
                  className='w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:text-primary hover:border-primary transition-colors'
                >
                  <Facebook />
                </Link>
                <Link
                  to='https://www.linkedin.com/in/nghia-le-1b3bb32b8/'
                  className='w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:text-primary hover:border-primary transition-colors'
                >
                  <Linkedin />
                </Link>
                <Link
                  to='https://www.instagram.com/nghialc81/'
                  className='w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:text-primary hover:border-primary transition-colors'
                >
                  <Instagram />
                </Link>
              </div>
            </div>
            </div>
        </section>
      </main>
    </section>
  )
}

export default About
