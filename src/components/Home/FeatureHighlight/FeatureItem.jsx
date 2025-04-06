import { MoveRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '~/components/common/ui/button'

const FeatureItem = ({ item, showButton = true }) => {
  return (
    <div className='flex flex-col p-6 shadow-md rounded-lg items-center'>
      <div className='h-16 w-16 rounded-full bg-heritage-light mb-6 flex items-center justify-center'>
        <item.icon className='h-8 w-8 text-heritage-dark' />
      </div>
      <h3 className='text-xl mb-3 font-medium text-heritage-dark'>{item.title}</h3>
      <p className='text-muted-foreground mb-4 flex-grow text-center'>{item.description}</p>
      {
        showButton && (
          <Link to={item.to} className='w-full'>
            <Button 
              className='w-full'
              variant='outline'
            >
              Khám phá ngay
              <MoveRight className='ml-2' size={16} />
            </Button>
          </Link>
        )
      }
    </div>
  )
}

export default FeatureItem
