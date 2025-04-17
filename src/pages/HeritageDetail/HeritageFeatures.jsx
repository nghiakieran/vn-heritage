import { Award, MapPin, Play, Star } from 'lucide-react'

const features = [
  { value: 'leaderboard', icon: <Award className='h-8 w-8 text-heritage mx-auto mb-2' />, label: 'Bảng xếp hạng' },
  { value: 'quiz', icon: <Star className='h-8 w-8 text-heritage mx-auto mb-2' />, label: 'Kiểm tra kiến thức' },
  { value: 'roleplay', icon: <Play className='h-8 w-8 text-heritage mx-auto mb-2' />, label: 'Trải nghiệm nhập vai' },
  { value: 'chatbot', icon: <MapPin className='h-8 w-8 text-heritage mx-auto mb-2' />, label: 'Hỏi đáp với trợ lý ảo' },
]

const HeritageFeatures = () => {
  return (
    <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
      {features.map((feature, index) => (
        <div
          key={index}
          className='p-4 border bg-heritage-light/20 rounded-md border-heritage-light 
          text-center hover:bg-heritage-light/30 transition-colors duration-200 transform hover:-translate-y-1 cursor-pointer'
        >
          {feature.icon}
          <p className='text-sm font-medium'>{feature.label}</p>
        </div>
      ))}
    </div>
  )
}

export default HeritageFeatures
