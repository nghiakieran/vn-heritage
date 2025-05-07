const TableRow = ({ ranking, formatDate, getInitials, getRankIcon }) => (
  <div className='flex items-center p-3 rounded-md bg-white border border-gray-300 hover:bg-gray-100 transition-colors'>
    <div className='w-8 text-center font-medium flex justify-center'>
      {getRankIcon(ranking?.rank) || ranking?.rank}
    </div>
    <div className='mx-3'>
      <div className='h-10 w-10 rounded-full bg-secondary flex items-center justify-center border border-border overflow-hidden'>
        {ranking?.avatarUrl ? (
          <img loading='lazy' src={ranking?.avatarUrl} alt={ranking?.displayName} className='h-full w-full object-cover' />
        ) : (
          <span className='text-secondary-foreground font-medium'>
            {getInitials(ranking?.displayName)}
          </span>
        )}
      </div>
    </div>
    <div className='flex-1'>
      <div className='font-medium text-foreground'>{ranking?.displayName}</div>
      <div className='text-sm text-muted-foreground'>Hoàn thành: {formatDate(ranking?.completeDate)}</div>
    </div>
    <div className='font-bold'>{ranking?.score} điểm</div>
  </div>
)

export default TableRow
