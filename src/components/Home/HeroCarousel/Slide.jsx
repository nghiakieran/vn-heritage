import React from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, MessageSquare } from 'lucide-react'

const Slide = ({ slide, index, activeIndex }) => {
  const isActive = index === activeIndex
  const slideStyle = {
    backgroundImage: `url(${slide.image})`,
    transform: isActive ? 'scale(1.05)' : 'scale(1)'
  }
  return (
    <div className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
      {/* Image */}
      <div className='absolute inset-0 bg-cover bg-center transition-transform duration-[8000ms] ease-out'
        style={slideStyle}
      />
      {/* Background Gradient */}
      <div className='absolute inset-0 bg-gradient-to-b from-black/55 via-black/45 to-black/60'/>
      {/* Content */}
      <div className='relative h-full flex flex-col items-center justify-center text-center px-6 sm:px-20'>
        <div className='max-w-5xl mx-auto'>
          <h1 className='text-4xl sm:text-6xl font-bold text-primary-foreground'>{slide.title}</h1>
          <p className='text-lg sm:text-xl mt-6 mb-10 text-primary-foreground/90'>{slide.subTitle}</p>
          <div className='flex flex-col sm:flex-row justify-center gap-4'>
            <Link to='/heritages'>
              <button className='inline-flex items-center justify-center px-6 py-3 font-medium bg-heritage hover:bg-heritage/80 text-primary-foreground w-52 shadow-lg transition-all duration-300 hover:scale-105 rounded-md'>
                <BookOpen className='mr-2' size={20} />
                Khám phá di tích
              </button>
            </Link>
            <Link to='/chatbot'>
              <button className='inline-flex items-center justify-center px-6 py-3 font-medium bg-primary-foreground/10 backdrop-blur-sm text-primary-foreground border border-primary-foreground hover:bg-primary-foreground/20 w-52 shadow-lg transition-all duration-300 hover:scale-105 rounded-md'>
                <MessageSquare className='mr-2' size={20} />
                Trợ lý AI
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Slide
