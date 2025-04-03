import React from 'react'
import HeritageList from '~/components/Heritage/HeritageList'
import { mockData } from '~/api/mock-data'
const Heritages = () => {
  const heritages = mockData.heritages
  const isLoading = false
  return (
    <section className='pt-navbar-mobile sm:pt-navbar'>
      <div className='lcn-container'>
        <div className='text-center animate-fade-up'>
          <h1 className="text-3xl sm:text-4xl font-medium text-heritage-dark mb-4">Khám phá các di tích lịch sử</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Tìm hiểu những địa danh văn hóa và lịch sử nổi bật trên khắp Việt Nam, nơi đã định hình nền văn minh của dân tộc.
          </p>
        </div>
        <div>
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
            </>
          )
        }
        </div>
      </div>
    </section>
  )
}

export default Heritages
