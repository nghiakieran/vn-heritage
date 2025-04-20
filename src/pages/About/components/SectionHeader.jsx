import Title from '~/components/common/Title'

const SectionHeader = ({ eyebrow, title, description }) => (
  <div className='text-center mb-16'>
    <span className='inline-block px-5 py-2 bg-heritage/90 text-white rounded-full font-medium mb-4'>
      {eyebrow}
    </span>
    <div>
      <Title title={title} className='text-3xl sm:text-4xl mb-6' />
    </div>
    <p className='text-lg max-w-3xl mx-auto'>{description}</p>
  </div>
)

export default SectionHeader
