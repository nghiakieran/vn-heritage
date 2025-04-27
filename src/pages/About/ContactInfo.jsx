import { Link } from 'react-router-dom'
import { contactInfo, socialLinks } from './data/contactData'

const ContactInfo = () => {
  return (     
    <div className='flex flex-col items-center justify-center'>
      <div className='flex flex-col space-y-6 max-w-md'>
        {contactInfo.map((item, index) => {
          const Icon = item.icon
          return (
            <div key={index} className='flex space-x-6 items-center'>
              <div className='flex-shrink-0 w-12 h-12 rounded-full bg-heritage-light flex items-center justify-center'>
                <Icon className='text-heritage-dark' />
              </div>
              <div>
                <h3 className='text-xl font-bold mb-1 text-heritage-dark'>{item.title}</h3>
                <p>{item.content}</p>
              </div>
            </div>
          )
        })}  
      </div>
      <div className='flex space-x-4 items-center justify-center mt-8'>
        {socialLinks.map((link, index) => {
          const Icon = link.icon
          return (
            <Link
              key={index}
              to={link.url}
              className='w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:text-primary hover:border-primary transition-colors'
              aria-label={link.label}
              target='_blank'
              rel='noopener noreferrer'
            >
              <Icon />
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default ContactInfo
