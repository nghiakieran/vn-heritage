
const HeritageInfo = ({ data }) => {
  return (
    <div className='border rounded-lg p-6 sticky top-24'>
      <h3 className='lcn-heritage-detail-title mb-4'>Thông tin chi tiết</h3>
      <dl className='space-y-4'>
        <div>
          <dt className='text-sm text-muted-foreground'>Địa chỉ</dt>
          <dd className='font-medium'>{data?.location}</dd>
        </div>
        <div>
          <dt className='text-sm text-muted-foreground'>Danh hiệu</dt>
          <dd className='font-medium'>Di tích quốc gia</dd>
        </div>
        <div>
          <dt className='text-sm text-muted-foreground'>Tọa độ</dt>
          <dd className='font-medium'>
            {data?.coordinates?.latitude}, {data?.coordinates?.longitude}
          </dd>
        </div>
      </dl>
    </div>
  )
}

export default HeritageInfo
