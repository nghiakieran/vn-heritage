import { ArrowRight, Landmark, MoveRight } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

import Title from '~/components/common/Title'
import { mockData } from '~/api/mock-data'
import HeritageList from '~/components/Heritage/HeritageList'

const PopularHeritage = () => {
  const heritages = mockData.heritages
  // Fake loading
  const isLoading = false
  return (
    <section>
      <div className='flex justify-between mb-10'>
        <Title icon={Landmark} title={'Di tích phổ biến'} />
        <Link to='/heritages' className='hidden sm:flex text-heritage items-center gap-2 hover:underline'>
          <span>Xem tất cả</span>
          <ArrowRight size={16} />
        </Link>
      </div>
      {
        isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {heritages.map((item) => (
              <div key={item._id} className="rounded-lg overflow-hidden border shadow animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4 space-y-3">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <HeritageList heritages={heritages}/>
              <Link to='/heritages' className='mt-8 inline-flex sm:hidden items-center justify-center gap-2 text-sm px-4 py-2 h-10 w-full font-medium border bg-heritage text-primary-foreground hover:bg-heritage-dark duration-300 transition-all rounded-md'>
                Xem tất cả di tích
                <MoveRight className='ml-2' size={16} />
              </Link>
          </>
        )
      }
    </section>
  )
}

export default PopularHeritage
