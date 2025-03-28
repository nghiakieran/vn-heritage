import React, { useEffect, useRef, useState } from 'react'
import Slide from './Slide'
import ArrowButton from './ArrowButton'

// Fake API
const heroSlides = [
  {
    _id: 1,
    image: 'https://images.unsplash.com/photo-1742156345582-b857d994c84e?q=50&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3',
    title: 'Khám phá Di sản Văn hóa Việt Nam',
    subTitle: 'Hành trình qua hàng thế kỷ lịch sử, văn hóa và thiên nhiên kỳ vĩ.'
  },
  {
    _id: 2,
    image: 'https://images.unsplash.com/photo-1741812191037-96bb5f12010a?q=50&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3',
    title: 'Ngược dòng thời gian',
    subTitle: 'Trải nghiệm những di tích lịch sử và văn hóa quan trọng nhất.'
  },
  {
    _id: 3,
    image: 'https://images.unsplash.com/photo-1741851374411-9528e6d2f33f?q=50&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3',
    title: 'Kết nối với quá khứ Việt Nam',
    subTitle: 'Đắm chìm trong những câu chuyện đã định hình nên dân tộc ta.'
  }
]

const HeroCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const timeoutRef = useRef(null)
  const slidesLength = heroSlides.length
  // Auto play Carousel
  useEffect(() => {
    if (isPaused) return
    const intervalId = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % heroSlides.length)
    }, 4000)
    return () => clearInterval(intervalId)
  }, [isPaused])

  const handleSlideChange = (newIndex) => {
    if (activeIndex === newIndex) return
    setActiveIndex(newIndex)
    setIsPaused(true)

    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    
    timeoutRef.current = setTimeout(() => { setIsPaused(false) }, 4000)
  }

  // Cleanup when component unmount
  useEffect(() => {
    return (() => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    })
  }, [])

  if (!slidesLength) return (
    <div className='pt-navbar-mobile sm:pt-navbar'>
      <div className='h-[calc(100vh-theme(spacing.navbar-mobile))] sm:h-[calc(100vh-theme(spacing.navbar))] bg-muted flex items-center justify-center'>
        <h4 className='text-muted-foreground'>Chưa có slider nào</h4>
      </div>
    </div>
  )

  return (
    <section className='relative w-full pt-navbar-mobile sm:pt-navbar' aria-label='Carousel di sản văn hóa'>
      <div className='relative w-full h-[calc(100vh-theme(spacing.navbar-mobile))] sm:h-[calc(100vh-theme(spacing.navbar))] overflow-hidden'>
        {
          heroSlides.map((slide, index) => (
            <Slide key={slide._id} slide={slide} index={index} activeIndex={activeIndex} />
          ))
        }
        <ArrowButton
          direction='left'
          onClick={() => handleSlideChange((activeIndex - 1 + slidesLength) % slidesLength)}
        />
        <ArrowButton
          direction='right'
          onClick={() => handleSlideChange((activeIndex + 1) % slidesLength)}
        />
        {/* Dot */}
        <div className='absolute bottom-8 z-30 left-0 right-0 flex justify-center gap-2'>
          {
            heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => handleSlideChange(index)}
                className={`h-2 rounded-full transition-all duration-500 ${activeIndex === index ? 
                  'bg-primary-foreground w-10' : 'bg-primary-foreground/50 w-2 hover:bg-primary-foreground/80'}`} 
              />
            ))
          }
        </div>
      </div>
    </section>
  )
}

export default HeroCarousel
