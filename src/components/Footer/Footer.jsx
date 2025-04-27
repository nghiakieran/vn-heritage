import { Link } from 'react-router-dom'
import { Mail } from 'lucide-react'
import { siFacebook, siInstagram } from 'simple-icons'
import SocialIcon from './SocialIcon'

const FOOTER_CONFIG = {
  socialLinks: [
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/le.chi.nghia.621880/',
      icon: siFacebook.path,
    },
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/nghialc81/',
      icon: siInstagram.path,
    },
  ],
  email: 'lechinghia202@gmail.com',
  navLinks: [
    { to: '/heritages', label: 'Di tích lịch sử' },
    { to: '/explore', label: 'Khám phá' },
    { to: '/about', label: 'Giới thiệu' },
  ],
}

const Footer = () => {
  return (
    <footer className='bg-gray-50 border-t border-gray-200'>
      <div className='lcn-container-x py-8'>
        <div className='flex flex-col md:flex-row justify-between items-center gap-6 sm:gap-8'>
          {/* Brand & Social */}
          <div className='flex flex-col items-center md:items-start space-y-4'>
            <h4 className='text-xl font-semibold tracking-tight text-heritage'>Heritage Reborn</h4>
            <p className='text-sm text-muted-foreground'>Khám phá kỳ quan văn hóa</p>
            <div className='flex space-x-4'>
              {FOOTER_CONFIG.socialLinks.map((social) => (
                <SocialIcon
                  key={social.name}
                  name={social.name}
                  url={social.url}
                  iconPath={social.icon}
                />
              ))}
            </div>
          </div>

          {/* Navigation */}
          <nav
            role='navigation'
            aria-label='Footer navigation'
            className='flex flex-col md:flex-row gap-4 md:gap-12'
          >
            {FOOTER_CONFIG.navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className='text-sm text-muted-foreground hover:text-heritage focus:text-heritage transition-colors duration-200'
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Contact */}
          <div className='flex items-center gap-2 text-muted-foreground'>
            <Mail size={20} />
            <a
              href={`mailto:${FOOTER_CONFIG.email}`}
              className='text-sm hover:text-heritage focus:text-heritage transition-colors duration-200'
            >
              {FOOTER_CONFIG.email}
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
