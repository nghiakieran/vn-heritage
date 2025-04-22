import { Award, MapPin, Play, Star } from 'lucide-react'

const features = [
  { value: 'leaderboard', icon: <Award className='h-8 w-8 text-heritage mx-auto mb-2' />, label: 'Bảng xếp hạng' },
  { value: 'knowledge-test', icon: <Star className='h-8 w-8 text-heritage mx-auto mb-2' />, label: 'Kiểm tra kiến thức' },
  { value: 'roleplay', icon: <Play className='h-8 w-8 text-heritage mx-auto mb-2' />, label: 'Trải nghiệm nhập vai' },
  { value: 'chatroom', icon: <MapPin className='h-8 w-8 text-heritage mx-auto mb-2' />, label: 'Tham gia chatroom' },
]

const HeritageFeatures = ({ handleFeatureClick }) => {
  return (
    <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
      {features.map((feature) => (
        <div
          key={feature.value}
          className='p-4 border bg-heritage-light/20 rounded-md border-heritage-light text-center hover:bg-heritage-light/50 transition-colors duration-200 cursor-pointer'
          onClick={() => handleFeatureClick(feature.value)}
        >
          {feature.icon}
          <p className='text-sm font-medium'>{feature.label}</p>
        </div>
      ))}
    </div>
  )
}

export default HeritageFeatures
