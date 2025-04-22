import { BookOpen, Loader2 } from 'lucide-react'
import { useState, useMemo} from 'react'
import { useGetKnowledgeTestsQuery } from '~/store/apis/knowledgeTestApi'
import KnowledgeTestDialog from './KnowledgeTestDialog'

const KnowledgeTestItem = ({ test, onClick }) => (
  <div
    onClick={() => onClick(test)}
    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick(test)}
    className='bg-white border rounded-lg p-4 hover:border-heritage hover:bg-heritage-light/10 cursor-pointer transition-all duration-200 flex items-start'
    role='button'
    tabIndex={0}
    aria-label={`Bài kiểm tra ${test?.title}`}
  >
    <div className='flex-1'>
      <h4 className='font-medium text-base mb-1'>{test?.title}</h4>
      <p className='text-sm text-muted-foreground line-clamp-2 mb-3'>{test?.content}</p>
      <div className='flex items-center text-sm text-muted-foreground'>
        <span className='mr-3'>{test?.stats?.totalAttempts || 0} lượt làm</span>
        <span className='flex items-center'>
          <span>Điểm TB:</span>
          <span className='ml-1 font-medium text-heritage-dark'>{test?.stats?.averageScore || 0}/100</span>
        </span>
      </div>
    </div>
  </div>
)

// Error message component
const ErrorMessage = ({ message, onRetry }) => (
  <div className='text-center py-6'>
    <p className='text-destructive'>{message}</p>
    <button
      onClick={onRetry}
      className='mt-4 px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors'
    >
      Thử lại
    </button>
  </div>
)

// Loading component
const LoadingState = () => (
  <div className='flex justify-center items-center py-8'>
    <Loader2 className='h-6 w-6 animate-spin text-heritage' />
    <span className='ml-2 text-muted-foreground'>Đang tải bài kiểm tra...</span>
  </div>
)

// Empty state component
const EmptyState = () => (
  <div className='flex flex-col items-center justify-center py-6 text-muted-foreground'>
    <BookOpen className='h-8 w-8 mb-2' />
    <p>Chưa có bài kiểm tra nào cho di tích này.</p>
  </div>
)

const HeritageKnowledgeTest = ({ heritageId, heritageName }) => {
  const [activeTest, setActiveTest] = useState(null)
  const { data, isLoading, error, refetch } = useGetKnowledgeTestsQuery(undefined, {
    // Add cache invalidation policies if needed
    refetchOnMountOrArgChange: true
  })

  const openTest = (test) => setActiveTest(test)
  const closeTest = () => setActiveTest(null)

  // Memoized filtering to avoid unnecessary recalculations
  const availableTests = useMemo(() => (
    data?.results?.filter(test => test.heritageId === heritageId) || []
  ), [data?.results, heritageId])

  if (error) {
    const errorMessage = error?.data?.message || error?.error || 'Đã xảy ra lỗi.'
    return <ErrorMessage message={errorMessage} onRetry={refetch} />
  }

  return (
    <div className='overflow-auto pr-1'>
      {isLoading ? (
        <LoadingState />
      ) : availableTests.length === 0 ? (
        <EmptyState />
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[70vh]'>
          {availableTests.map((test) => (
            <KnowledgeTestItem 
              key={test?._id} 
              test={test} 
              onClick={openTest} 
            />
          ))}
        </div>
      )}

      {activeTest && (
        <KnowledgeTestDialog
          open={Boolean(activeTest)}
          onClose={closeTest}
          testId={activeTest._id}
          testInfo={activeTest}
          heritageName={heritageName}
        />
      )}
    </div>
  )
}

export default HeritageKnowledgeTest
