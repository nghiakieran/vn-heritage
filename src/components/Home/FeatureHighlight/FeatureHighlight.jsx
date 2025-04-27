import { lazy, Suspense } from 'react'
import { Sparkles } from 'lucide-react'

import Title from '~/components/common/Title'
import { featuredData } from './featuredData'

const FeatureItem = lazy(() => import('./FeatureItem'))

const FeatureHighlight = () => {
  return (
    <section>
      <Title icon={Sparkles} title={'Tính năng nổi bật'} />
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10'>
        {featuredData?.map((item) => (
          <div key={item._id} className='h-full'>
            <Suspense fallback={<div className='animate-pulse bg-gray-200 rounded-lg h-[300px] w-full' />}>
              <FeatureItem item={item} className='h-full'/>
            </Suspense>
          </div>   
        ))}
      </div>
    </section>
  )
}

export default FeatureHighlight
