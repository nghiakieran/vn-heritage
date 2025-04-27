import { coreValues } from './data/coreValuesData'

const CoreValues = () => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
      {coreValues.map((value, index) => (
        <div key={index} className='bg-white border rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow h-full'>
          <div className='text-4xl mb-4 text-center' aria-hidden='true'>{value.icon}</div>
          <h3 className='text-xl font-bold mb-3 text-center text-heritage-dark'>{value.title}</h3>
          <p className='text-justify'>{value.description}</p>
        </div>
      ))}
    </div>
  )
}

export default CoreValues
