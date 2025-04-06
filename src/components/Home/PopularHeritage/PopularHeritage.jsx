import { ArrowRight, Landmark, MoveRight } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

import Title from '~/components/common/Title'
import { mockData } from '~/api/mock-data'
import HeritageList from '~/components/Heritage/HeritageList'
import HeritageSkeleton from '~/components/Heritage/HeritageSkeleton'
import { Button } from '~/components/common/ui/button'

const PopularHeritage = () => {
  const heritages = mockData.heritages.slice(0, 6)
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
          <HeritageSkeleton count={6} />
        ) : (
          <>
            <HeritageList heritages={heritages}/>
              <Link to='/heritages' className='sm:hidden w-full'>
                <Button className='w-full mt-8'>
                  Xem tất cả di tích
                  <MoveRight className='ml-2' size={16} />
                </Button>
              </Link>
          </>
        )
      }
    </section>
  )
}

export default PopularHeritage
