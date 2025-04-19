import Title from '~/components/common/Title'

const timelineItems = [
  {
    year: '01/2025',
    title: 'Khởi nguồn ý tưởng',
    description:
      'Ý tưởng về một nền tảng kết hợp công nghệ và di sản văn hóa được hình thành, với mục tiêu tạo ra trải nghiệm mới mẻ cho người dùng khi tìm hiểu về di tích lịch sử.',
    img: '/images/idea-inception.svg',
  },
  {
    year: '02/2025',
    title: 'Nghiên cứu và phát triển',
    description:
      'Giai đoạn nghiên cứu chuyên sâu về các di tích lịch sử Việt Nam, đồng thời phát triển các công nghệ tương tác để tạo trải nghiệm người dùng tốt nhất.',
    img: '/images/idea-inception.svg',
  },
  {
    year: '03/2025',
    title: 'Ra mắt phiên bản thử nghiệm',
    description:
      'Phiên bản beta của nền tảng được ra mắt với các tính năng cơ bản, nhận được nhiều phản hồi tích cực từ cộng đồng.',
    img: '/images/idea-inception.svg',
  },
  {
    year: '04/2025',
    title: 'Mở rộng và phát triển',
    description:
      'Nền tảng được phát triển toàn diện với nhiều tính năng mới như trải nghiệm nhập vai, bản đồ tương tác, trợ lý ảo và cộng đồng người dùng ngày càng mở rộng.',
    img: '/images/idea-inception.svg'
  },
]

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
                    <img src={item.img || 'https://placehold.co/600x400'} alt={item.title} className='object-cover' loading='lazy' />
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
