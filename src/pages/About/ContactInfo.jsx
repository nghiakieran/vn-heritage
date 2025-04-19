import { Facebook, Instagram, Linkedin, Mail, MessagesSquare, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'

const contactInfo = [
  {
    icon: <Mail className='text-heritage-dark' />,
    title: 'Email',
    content: 'lechinghia202@gmail.com'
  },
  {
    icon: <Phone className='text-heritage-dark' />,
    title: 'Điện thoại',
    content: '0946064930'
  },
  {
    icon: <MessagesSquare className='text-heritage-dark' />,
    title: 'Mạng xã hội',
    content: 'Lê Chí Nghĩa'
  }
]

const socialLinks = [
  {
    icon: <Facebook />,
    url: 'https://www.facebook.com/le.chi.nghia.621880/'
  },
  {
    icon: <Linkedin />,
    url: 'https://www.linkedin.com/in/nghia-le-1b3bb32b8/'
  },
  {
    icon: <Instagram />,
    url: 'https://www.instagram.com/nghialc81/'
  }
]

const ContactInfo = () => {

  return (
      <div className='lcn-container-x'>       
        <div className='flex-col items-center justify-center'>
          <div className='flex items-center justify-center p-4 gap-4'>
            <div className='flex flex-col space-y-6'>
              {contactInfo.map((item, index) => (
                <div key={index} className='flex space-x-6 items-center'>
                  <div className='flex-shrink-0 w-12 h-12 rounded-full bg-heritage-light flex items-center justify-center'>
                    {item.icon}
                  </div>
                  <div>
                    <h3 className='text-xl font-bold mb-1 text-heritage-dark'>{item.title}</h3>
                    <p>{item.content}</p>
                  </div>
                </div>
              ))}
            </div>                
          </div>
          <div className='flex space-x-4 items-center justify-center mt-8'>
            {socialLinks.map((link, index) => (
              <Link
                key={index}
                to={link.url}
                className='w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:text-primary hover:border-primary transition-colors'
              >
                {link.icon}
              </Link>
            ))}
          </div>
        </div>
      </div>
  )
}

export default ContactInfo
