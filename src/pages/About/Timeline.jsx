import Title from '~/components/common/Title'
import { timelineItems } from './data/timelineData'

const Timeline = () => {
  return (
    <div className='relative'>
      {/* Timeline Line */}
      <div className='absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-primary/10'></div>

      {/* Timeline Items */}
      <div className='space-y-24'>
        {timelineItems.map((item, index) => (
          <div key={index} className='relative'>
            {/* Timeline Dot */}
            <div className='absolute left-1/2 transform -translate-x-1/2 -mt-4 w-8 h-8 rounded-full bg-primary border-4 border-white z-10'></div>

            <div className={`flex flex-col ${index % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'} gap-8`}>
              <div className={`sm:w-1/2 p-6 ${index % 2 === 0 ? 'pl-0 ' : 'pr-0'}`}>
                <div className={`${index % 2 === 0 ? 'sm:text-right' : 'sm:text-left'}`}>
                  <Title title={item.year} className={'text-3xl sm:text-4xl mb-4'} />
                  <h3 className='text-2xl font-bold mb-4 text-heritage-dark'>{item.title}</h3>
                  <p className='text-justify'>{item.description}</p>
                </div>
              </div>
              <div className={`sm:w-1/2 p-6 ${index % 2 === 0 ? 'pr-0 ' : 'pl-0'}`}>
                <div className='rounded-xl overflow-hidden shadow-sm transform transition-transform'>
                  <div className='aspect-video'>
                    <img
                      src={item.img || 'https://placehold.co/600x400'}
                      alt={item.title}
                      className='object-cover w-full h-full'
                      width='600'
                      height='338'
                      loading='lazy'
                      />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Timeline
