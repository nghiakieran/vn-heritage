import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { Clock, ChevronLeft, ChevronRight, Loader2, AlertTriangle } from 'lucide-react'
import { cn } from '~/lib/utils'
import { useLazyGetKnowledgeTestByIdQuery, useSubmitKnowledgeTestAttemptMutation } from '~/store/apis/knowledgeTestApi'
import { Dialog, DialogDescription, DialogHeader, DialogTitle } from '~/components/common/ui/Dialog'

// Constants
const DEFAULT_TIME_PER_QUESTION = 120 // 2 minutes per question
const TRANSITION_DELAY = 300

// Sub-components
const TestResults = ({ results, onClose }) => (
  <div className='space-y-6'>
    <h3 className='text-xl font-semibold'>Kết quả bài kiểm tra</h3>
    <div className='text-center py-4'>
      <div className='text-3xl font-bold text-heritage mb-2'>{results?.score || 0}/100</div>
      <p className='text-muted-foreground'>Điểm số của bạn</p>
    </div>
    
    <button
      onClick={onClose}
      className='w-full py-2 bg-heritage text-white rounded-md hover:bg-heritage-dark transition-colors'
    >
      Đóng
    </button>
  </div>
)

const TestError = ({ onClose }) => (
  <div className='text-center py-8 space-y-4'>
    <div className='rounded-full bg-destructive/10 p-3 w-16 h-16 mx-auto flex items-center justify-center'>
      <AlertTriangle className='h-8 w-8 text-destructive' />
    </div>
    <div>
      <p className='text-lg font-medium'>Không thể tải bài kiểm tra</p>
      <p className='text-muted-foreground mt-1'>Vui lòng thử lại sau</p>
    </div>
    <button 
      onClick={onClose} 
      className='px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors'
    >
      Đóng
    </button>
  </div>
)

const TestLoading = () => (
  <div className='flex flex-col items-center justify-center py-12'>
    <Loader2 className='h-10 w-10 animate-spin text-heritage mb-4' />
    <p className='text-muted-foreground'>Đang tải bài kiểm tra...</p>
  </div>
)

const QuestionOption = ({ option, isSelected, onSelect }) => (
  <div
    onClick={onSelect}
    className={cn(
      'border rounded-lg p-4 cursor-pointer transition-all duration-200',
      isSelected ? 'border-heritage bg-heritage-light/20 shadow-sm' : 'hover:border-muted-foreground/30 hover:bg-secondary/50'
    )}
  >
    <div className='flex items-center'>
      <div className={cn(
        'w-5 h-5 rounded-sm border flex items-center justify-center mr-3 flex-shrink-0 transition-colors', 
        isSelected ? 'border-heritage bg-white' : 'border-muted-foreground/30 bg-white'
      )}>
        {isSelected && <div className='w-3 h-3 rounded-sm bg-heritage'></div>}
      </div>
      <span className='text-base'>{option.optionText}</span>
    </div>
  </div>
)

const NavigationButtons = ({ 
  currentQuestionIndex, 
  // totalQuestions, 
  onPrev, 
  onNext, 
  onSubmit, 
  isSubmitting, 
  isTransitioning,
  isLastQuestion 
}) => (
  <div className='flex justify-between pt-4 mt-6'>
    <button
      onClick={onPrev}
      disabled={currentQuestionIndex === 0 || isTransitioning}
      className={cn(
        'flex items-center px-4 py-2 rounded-md transition-colors',
        currentQuestionIndex === 0 || isTransitioning 
          ? 'text-muted-foreground bg-secondary/50 cursor-not-allowed' 
          : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
      )}
      aria-label='Câu trước'
    >
      <ChevronLeft className='h-4 w-4 mr-1' />
      Câu trước
    </button>

    <button
      onClick={isLastQuestion ? onSubmit : onNext}
      disabled={isSubmitting || isTransitioning}
      className={cn(
        'flex items-center px-4 py-2 rounded-md transition-colors',
        isSubmitting || isTransitioning 
          ? 'bg-heritage/70 text-white cursor-not-allowed' 
          : 'bg-heritage text-white hover:bg-heritage-dark'
      )}
      aria-label={isLastQuestion ? 'Nộp bài' : 'Câu tiếp theo'}
    >
      {isSubmitting ? (
        <>
          <Loader2 className='h-4 w-4 mr-2 animate-spin' />
          Đang nộp bài...
        </>
      ) : isLastQuestion ? (
        'Nộp bài'
      ) : (
        <>
          Câu tiếp theo
          <ChevronRight className='h-4 w-4 ml-1' />
        </>
      )}
    </button>
  </div>
)

const QuestionPagination = ({ 
  questions, 
  currentIndex, 
  answeredQuestions, 
  onSelectQuestion 
}) => (
  <div className='flex flex-wrap gap-2 justify-center pt-2'>
    {questions.map((question, index) => (
      <button
        key={question.questionId}
        onClick={() => onSelectQuestion(index)}
        className={cn(
          'w-8 h-8 rounded-full border-2 text-sm font-medium transition-colors',
          index === currentIndex
            ? 'bg-heritage text-white border-heritage'
            : answeredQuestions[question.questionId]
            ? 'bg-heritage-light text-heritage'
            : 'bg-secondary text-muted-foreground'
        )}
        aria-label={`Câu hỏi ${index + 1}`}
        aria-current={index === currentIndex ? 'true' : 'false'}
      >
        {index + 1}
      </button>
    ))}
  </div>
)

// Main component
const KnowledgeTestDialog = ({ open, onClose, testId, testInfo }) => {
  // State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(null)
  const [results, setResults] = useState(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  
  // Refs
  const contentRef = useRef(null)
  const timerRef = useRef(null)
  
  // API hooks
  const [fetchTest, { data: test, isLoading, isFetching, error }] = useLazyGetKnowledgeTestByIdQuery()
  const [submitAttempt, { isLoading: isSubmitting }] = useSubmitKnowledgeTestAttemptMutation()

  // Memoized values
  const currentQuestion = useMemo(() => 
    test?.questions?.[currentQuestionIndex], 
    [test, currentQuestionIndex]
  )
  
  const totalQuestions = useMemo(() => 
    test?.questions?.length || 0, 
    [test]
  )
  
  const progressPercentage = useMemo(() => 
    ((currentQuestionIndex + 1) / (totalQuestions || 1)) * 100, 
    [currentQuestionIndex, totalQuestions]
  )
  
  const isLastQuestion = useMemo(() => 
    currentQuestionIndex === totalQuestions - 1, 
    [currentQuestionIndex, totalQuestions]
  )

  // Helper functions
  const formatTime = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }, [])

  const resetTest = useCallback(() => {
    setResults(null)
    setSelectedAnswers({})
    setCurrentQuestionIndex(0)
    setTimeLeft(null)
    
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const startTransition = useCallback((callback) => {
    if (isTransitioning) return
    
    setIsTransitioning(true)
    setTimeout(() => {
      callback()
      setIsTransitioning(false)
    }, TRANSITION_DELAY)
  }, [isTransitioning])

  // Event handlers
  const handleAnswerSelect = useCallback((questionId, optionId) => {
    if (results) return // Prevent changes after submission

    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: [optionId], // Handle single choice selection
    }))
  }, [results])

  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < totalQuestions - 1) {
      startTransition(() => setCurrentQuestionIndex(prev => prev + 1))
    }
  }, [currentQuestionIndex, totalQuestions, startTransition])

  const handlePrevQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      startTransition(() => setCurrentQuestionIndex(prev => prev - 1))
    }
  }, [currentQuestionIndex, startTransition])

  const handleSelectQuestion = useCallback((index) => {
    startTransition(() => setCurrentQuestionIndex(index))
  }, [startTransition])

  const handleSubmitTest = useCallback(async () => {
    if (isSubmitting || !test) return

    try {
      const formattedAnswers = Object.entries(selectedAnswers).map(([questionId, optionIds]) => ({
        questionId,
        selectedOptionIds: optionIds,
      }))
      
      const result = await submitAttempt({
        testId: test._id,
        answers: { answers: formattedAnswers },
      }).unwrap()

      setResults(result)
      
      // Clear timer when test is submitted
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    } catch (err) {
      console.error('Error submitting test:', err)
    }
  }, [isSubmitting, test, selectedAnswers, submitAttempt])

  // Side effects
  useEffect(() => {
    if (open && testId) {
      resetTest()
      fetchTest(testId)
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [open, testId, fetchTest, resetTest])

  useEffect(() => {
    if (test && open) {
      const defaultTimeLimit = totalQuestions * DEFAULT_TIME_PER_QUESTION
      setTimeLeft(defaultTimeLimit)
    }
  }, [test, open, totalQuestions])

  useEffect(() => {
    if (!open || !timeLeft || timeLeft <= 0 || results) return

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          handleSubmitTest()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [open, timeLeft, results, handleSubmitTest])

  useEffect(() => {
    if (contentRef.current) contentRef.current.scrollTop = 0
  }, [currentQuestionIndex])

  if (!open) return null

  // Conditional rendering based on state
  const renderContent = () => {
    if (isLoading || isFetching) return <TestLoading />
    if (error) return <TestError onClose={onClose} />
    if (results) return <TestResults results={results} onClose={onClose} />
    
    return (
      <div className='space-y-6'>
        <button
          onClick={onClose}
          className='px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors'
          aria-label='Quay lại chọn bài kiểm tra'
        >
          Quay lại chọn bài kiểm tra
        </button>
        
        {/* Question info and timer */}
        <div className='flex justify-between items-center'>
          <div className='text-base'>Câu {currentQuestionIndex + 1}/{totalQuestions}</div>
          <div className={cn(
            'flex items-center px-3 py-1.5 rounded-full text-sm font-medium', 
            timeLeft && timeLeft < 60 
              ? 'bg-destructive/10 text-destructive animate-pulse' 
              : 'bg-heritage-light/50 text-heritage-dark'
          )}>
            <Clock className='h-4 w-4 mr-1.5' />
            <span>{formatTime(timeLeft || 0)}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div 
          className='w-full h-2 bg-secondary/50 rounded-full overflow-hidden' 
          role='progressbar' 
          aria-valuemin='0' 
          aria-valuemax='100' 
          aria-valuenow={progressPercentage}
        >
          <div
            className='h-full bg-heritage rounded-full transition-all duration-300'
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>

        {/* Current question */}
        {currentQuestion && (
          <div className={cn(
            'space-y-5 transition-opacity duration-300', 
            isTransitioning ? 'opacity-0' : 'opacity-100'
          )}>
            <h3 className='text-lg font-medium'>{currentQuestion.content}</h3>

            {currentQuestion.image && (
              <div className='mb-5'>
                <img 
                  src={currentQuestion.image || '/placeholder.svg'} 
                  alt='Hình minh họa câu hỏi' 
                  className='rounded-md w-full object-cover' 
                  loading='lazy'
                />
              </div>
            )}

            <div className='space-y-2'>
              {currentQuestion.options.map((option) => (
                <QuestionOption
                  key={option.optionId}
                  option={option}
                  isSelected={selectedAnswers[currentQuestion.questionId]?.includes(option.optionId)}
                  onSelect={() => handleAnswerSelect(currentQuestion.questionId, option.optionId)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <NavigationButtons
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={totalQuestions}
          onPrev={handlePrevQuestion}
          onNext={handleNextQuestion}
          onSubmit={handleSubmitTest}
          isSubmitting={isSubmitting}
          isTransitioning={isTransitioning}
          isLastQuestion={isLastQuestion}
        />

        {/* Question pagination */}
        {test?.questions && (
          <QuestionPagination
            questions={test.questions}
            currentIndex={currentQuestionIndex}
            answeredQuestions={selectedAnswers}
            onSelectQuestion={handleSelectQuestion}
          />
        )}
      </div>
    )
  }

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      className='max-w-lg relative flex flex-col max-h-[90vh] p-0'
      aria-labelledby='test-dialog-title'
    >
      <DialogHeader className='flex-shrink-0 p-6 pb-4'>
        <DialogTitle id='test-dialog-title'>
          {test?.title || testInfo?.title || 'Kiểm tra di tích lịch sử A'}
        </DialogTitle>
        <DialogDescription>
          {test?.content || testInfo?.content || 'Bài kiểm tra này giúp bạn hiểu rõ hơn về di tích lịch sử.'}
        </DialogDescription>
      </DialogHeader>

      <div ref={contentRef} className='p-6 pt-2 overflow-y-auto'>
        {renderContent()}
      </div>
    </Dialog>
  )
}

export default KnowledgeTestDialog