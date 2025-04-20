const VisionItem = ({ icon, title, description }) => (
  <div className='flex items-start'>
    <div className='flex-shrink-0 h-12 w-12 rounded-full bg-heritage-light flex items-center justify-center mr-4'>
      {icon}
    </div>
    <div>
      <h3 className='text-xl mb-2 font-bold text-heritage-dark'>{title}</h3>
      <p>{description}</p>
    </div>
  </div>
)

export default VisionItem
