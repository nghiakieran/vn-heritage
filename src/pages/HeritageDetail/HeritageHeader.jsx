import { ArrowLeft, Heart, Share, Star } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '~/components/common/ui/Button'

const HeritageHeader = ({ data, isAuthenticated }) => {
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: data?.name,
        text: `Khám phá ${data?.name} - ${data?.description}`,
        url: window.location.href,
      }).catch((error) => console.log('Error sharing', error))
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  return (
    <div className='relative overflow-hidden h-[44vh] sm:h-[50vh]'>
      <div className='absolute inset-0'>
        <img
          src={data?.images[0] || 'https://placehold.co/600x400?text=Di+t%C3%ADch+L%E1%BB%8Bch+s%E1%BB%AD&font=roboto'} 
          alt={data?.name}
          loading='lazy'
          className='aspect-video w-full h-full object-cover'
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent'></div>
      </div>
      <div className='absolute bottom-0 inset-x-0 lcn-container-x py-8'>
        <Link to='/heritages'>
          <Button variant='ghost' size='sm' className='mb-4 text-primary-foreground hover:bg-primary-foreground/30'>
            <ArrowLeft size={16} />
            <span>Quay lại danh sách di tích</span>
          </Button>
        </Link>
        <div className='flex flex-wrap items-center justify-between gap-4'>
          <div>
            <div className='flex items-center space-x-2 mb-2'>
              <span className='px-2 py-1 bg-heritage/90 text-white text-xs rounded-full'>
                {data?.coordinates?.latitude}
              </span>
              <span className='px-2 py-1 bg-white/20 backdrop-blur-sm text-white text-xs rounded-full'>
                {data?.coordinates?.longitude}
              </span>
            </div>
            <h1 className='text-3xl sm:text-4xl font-medium text-white'>
              {data?.name}
            </h1>
            <div className='flex items-center mt-2 text-white'>
              <Star size={20} className='fill-yellow-400 text-yellow-400 mr-1'/>
              <span className='font-medium'>{data?.stats?.averageRating || 0.0}</span>
              <span className='text-white/80 text-sm ml-1'>({data?.stats?.totalReviews || 0})</span>
            </div>
          </div>
          <div className='flex space-x-2'>
            {isAuthenticated && (
              <Button variant='outline' className='backdrop-blur-sm hover:bg-white/30 text-white bg-white/20 border group'>
                <Heart size={16}/>
                <span>Yêu thích</span>
              </Button>
            )}
            <Button 
              variant='outline'
              className='backdrop-blur-sm hover:bg-white/30 text-white bg-white/20 border'
              onClick={handleShare}
              >
              <Share size={16} />
              <span>Chia sẻ</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeritageHeader
