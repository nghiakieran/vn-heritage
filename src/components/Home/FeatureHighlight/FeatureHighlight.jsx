import React from 'react'
import { Sparkles, MessageSquare, Brain, Theater } from 'lucide-react'

import Title from '~/components/common/Title'
import FeatureItem from './FeatureItem'

const featuredData = [
  {
    _id: 1,
    icon: Brain,
    title: 'Kiểm tra kiến thức',
    description: 'Thử thách bản thân với các câu hỏi trắc nghiệm và học hỏi thêm về di sản văn hóa.',
    to: '/heritages'
  },
  {
    _id: 2,
    icon: Theater,
    title: 'Trải nghiệm nhập vai',
    description: 'Khám phá lịch sử qua góc nhìn của các nhân vật lịch sử trong các sự kiện quan trọng.',
    to: '/heritages'
  },
  {
    _id: 3,
    icon: MessageSquare,
    title: 'Chat với AI',
    description: 'Trò chuyện với trợ lý AI để tìm hiểu về di tích lịch sử và văn hóa Việt Nam.',
    to: '/chatbot'
  }
]

const FeatureHighlight = () => {
  return (
    <section>
      <Title icon={Sparkles} title={'Tính năng nổi bật'}/>
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10'>
        {
          featuredData.map(item => (
            <FeatureItem key={item._id} item={item} />
          ))
        }
      </div>
    </section>
  )
}

export default FeatureHighlight
