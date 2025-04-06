
const Title = ({ icon: Icon, title }) => {
  return (
    <div className='flex items-center'>
      {Icon && <Icon className='w-5 h-5 sm:w-6 sm:h-6 mr-2 text-heritage' />}
      <h2 className='text-3xl text-heritage-dark font-medium tracking-tight'>{title}</h2>
    </div>
  )
}

export default Title
