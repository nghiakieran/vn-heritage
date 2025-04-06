import { Link } from 'react-router-dom'
import { Mail } from 'lucide-react'
import { siFacebook, siInstagram } from 'simple-icons'

const Footer = () => {
  return (
    <footer className='bg-gray-50 border-t border-gray-200'>
      <div className='container max-w-7xl mx-auto px-6 py-8'>
        <div className='flex flex-col md:flex-row justify-between items-center gap-6 sm:gap-8'>
          {/* Brand & Social */}
          <div className='flex flex-col items-center md:items-start space-y-4'>
            <h4 className='text-xl text-heritage font-semibold tracking-tight'>Heritage</h4>
            <p className='text-sm text-muted-foreground'>Khám phá kì quan văn hóa</p>
            <div className='flex space-x-4'>
              <Link to="https://www.facebook.com/le.chi.nghia.621880/" className="group">
                <svg role="img" width="20" height="20" viewBox="0 0 24 24" className="opacity-65 group-hover:fill-heritage transition-colors">
                  <title>Facebook</title>
                  <path d={siFacebook.path} />
                </svg>
              </Link>
              <Link to='https://www.instagram.com/nghialc81/' className='group'>
                <svg role="img" width="20" height="20" viewBox="0 0 24 24" className='opacity-65 group-hover:fill-heritage transition-colors'>
                  <title>Instagram</title>
                  <path d={siInstagram.path} />
                </svg>
              </Link>
            </div>
          </div>
          {/* Navigation */}
          <div className='flex flex-col md:flex-row gap-4 md:gap-12'>
            <Link to='/heritages' className='text-sm text-muted-foreground hover:text-heritage transition-colors'>
              Di tích lịch sử
            </Link>
            <Link to='/about' className='text-sm text-muted-foreground hover:text-heritage transition-colors'>
              Giới thiệu
            </Link>
            <Link to='/chatbot' className='text-sm text-muted-foreground hover:text-heritage transition-colors'>
              Trợ lý AI
            </Link>
          </div>
          {/* Contact */}
          <div className='flex items-center gap-2 text-muted-foreground'>
            <Mail size={20} />
            <span className='text-sm'>lechinghia202@gmail.com</span>
          </div>
        </div>    
      </div>
    </footer>
  )
}

export default Footer