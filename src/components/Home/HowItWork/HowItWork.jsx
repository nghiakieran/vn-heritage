import { lazy, Suspense } from 'react'
import { Workflow } from 'lucide-react'

import Title from '~/components/common/Title'
import { howItWorksSteps } from './howItWorksSteps'

const FeatureItem = lazy(() => import('~/components/Home/FeatureHighlight/FeatureItem'))

const HowItWork = () => {
  return (
    <section>
      <Title icon={Workflow} title={'Cách thức hoạt động'} />
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10'>
        <Suspense fallback={<div className='col-span-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className='animate-pulse bg-gray-200 rounded-lg h-[300px] w-full' />
          ))}
        </div>}>
          {howItWorksSteps.map(item => (
            <FeatureItem key={item._id} item={item} showButton={false} />
          ))}
        </Suspense>
      </div>
    </section>
  )
}

export default HowItWork
