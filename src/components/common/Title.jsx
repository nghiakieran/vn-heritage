import { cn } from '~/lib/utils'

const Title = ({ icon: Icon, title, className }) => {
  return (
    <div className='inline-flex items-center'>
      {Icon && <Icon className='w-5 h-5 sm:w-6 sm:h-6 mr-2 text-heritage' />}
      <h2 className={cn('text-3xl text-heritage-dark font-medium tracking-tight', className)}>{title}</h2>
    </div>
  )
}

export default Title
