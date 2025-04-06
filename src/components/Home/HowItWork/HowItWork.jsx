import { Brain, MessageSquare, Search, UserPlus, Workflow } from 'lucide-react'

import Title from '~/components/common/Title'
import FeatureItem from '~/components/Home/FeatureHighlight/FeatureItem'

// Fake data
const howItWorksSteps = [
  {
    _id: 1,
    icon: UserPlus,
    title: "Đăng ký tài khoản",
    description: "Tạo tài khoản để truy cập đầy đủ tính năng",
    linkTo: "/register"
  },
  {
    _id: 2,
    icon: Search,
    title: "Tìm kiếm di tích",
    description: "Khám phá các di tích lịch sử trên khắp Việt Nam",
    linkTo: "/search"
  },
  {
    _id: 3,
    icon: Brain,
    title: "Trải nghiệm tương tác",
    description: "Tham gia các hoạt động tương tác và kiểm tra kiến thức",
    linkTo: "/heritages"
  },
  {
    _id: 4,
    icon: MessageSquare,
    title: "Chia sẻ & Đánh giá",
    description: "Chia sẻ trải nghiệm và đánh giá di tích lịch sử",
    linkTo: "/chatbot"
  }
]

const HowItWork = () => {
  return (
    <section>
      <Title icon={Workflow} title={'Cách thức hoạt động'} />
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10'>
        {
          howItWorksSteps.map(item => (
            <FeatureItem key={item._id} item={item} showButton={false} />
          ))
        }
      </div>
    </section>
  )
}

export default HowItWork
