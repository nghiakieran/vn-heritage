import { Facebook, Linkedin } from 'lucide-react'
import { Link } from 'react-router-dom'

const teamMembers = [
  {
    name: 'Nguyễn An Thành Phát',
    role: 'Founder & Leader',
    bio: 'Với hơn 3 năm kinh nghiệm trong lĩnh vực phát triển website.',
    img: '/images/profile.jpg',
    social: {
      facebook: 'https://www.facebook.com/',
      linkedin: 'https://www.linkedin.com/'
    }
  },
  {
    name: 'Lê Quốc Nam',
    role: 'Backend Developer',
    bio: 'Chuyên gia công nghệ với kinh nghiệm phát triển backend với các nền tảng tương tác và ứng dụng AI vào sản phẩm.',
    img: '/images/profile.jpg',
    social: {
      facebook: 'https://www.facebook.com/',
      linkedin: 'https://www.linkedin.com/'
    }
  },
  {
    name: 'Phan Văn Thuận',
    role: 'Backend Developer',
    bio: 'Nhà nghiên cứu công nghệ với kinh nghiệm thiết kế database mạnh mẽ, sử dụng các công nghệ hiện đại.',
    img: '/images/profile.jpg',
    social: {
      facebook: 'https://www.facebook.com/',
      linkedin: 'https://www.linkedin.com/'
    }
  },
  {
    name: 'Lê Chí Nghĩa',
    role: 'Frontend Developer',
    bio: 'Nhà thiết kế với niềm đam mê tạo ra trải nghiệm người dùng trực quan và hấp dẫn.',
    img: '/images/profile.jpg',
    social: {
      facebook: 'https://www.facebook.com/le.chi.nghia.621880/',
      linkedin: 'https://www.linkedin.com/in/nghia-le-1b3bb32b8/'
    }
  },
  {
    name: 'Nguyễn Thanh Hùng',
    role: 'AI Specialist',
    bio: 'Chuyên gia AI với kinh nghiệm phát triển các hệ thống trợ lý ảo thông minh.',
    img: '/images/profile.jpg',
    social: {
      facebook: 'https://www.facebook.com/',
      linkedin: 'https://www.linkedin.com/'
    }
  },
]

const TeamMembers = () => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16'>
      {teamMembers.map((member, index) => (
        <div key={index} className='group text-center'>
          <div className='relative mb-6 overflow-hidden rounded-xl aspect-square text-left'>
            <img
              src={member.img || 'https://placehold.co/600x400'}
              alt={member.name}
              className='object-cover w-full h-full transition-transform duration-500 group-hover:scale-110'
              loading='lazy'
              width='300'
              height='300'
            />
            <div className='absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6'>
              <div className='text-white'>
                <p className='font-medium'>{member.bio}</p>
                <div className='flex space-x-3 mt-4'>
                  <Link
                    to={member.social.facebook}
                    className='text-white hover:text-heritage-light transition-colors'
                    aria-label={`Facebook của ${member.name}`}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <Facebook size={20} />
                  </Link>
                  <Link
                    to={member.social.linkedin}
                    className='text-white hover:text-heritage-light transition-colors'
                    aria-label={`LinkedIn của ${member.name}`}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <Linkedin size={20} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <h3 className='text-xl font-bold text-heritage-dark'>{member.name}</h3>
          <p className='text-primary'>{member.role}</p>
        </div>
      ))}
    </div>
  )
}

export default TeamMembers
