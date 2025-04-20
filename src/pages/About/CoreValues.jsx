const coreValues = [
  {
    icon: '🔍',
    title: 'Chính xác',
    description:
      'Cam kết cung cấp thông tin chính xác, đáng tin cậy và được nghiên cứu kỹ lưỡng về di sản văn hóa.',
  },
  {
    icon: '🌱',
    title: 'Bảo tồn',
    description: 'Đặt sự bảo tồn và tôn trọng giá trị di sản văn hóa lên hàng đầu trong mọi hoạt động.',
  },
  {
    icon: '🔄',
    title: 'Đổi mới',
    description:
      'Không ngừng đổi mới và áp dụng công nghệ tiên tiến để tạo ra trải nghiệm học tập hấp dẫn.',
  },
  {
    icon: '🤝',
    title: 'Hợp tác',
    description:
      'Xây dựng mối quan hệ hợp tác với các chuyên gia, tổ chức và cộng đồng để phát triển nền tảng.',
  },
  {
    icon: '🌍',
    title: 'Tiếp cận',
    description:
      'Cam kết tạo ra nền tảng dễ tiếp cận cho mọi đối tượng, không phân biệt tuổi tác hay nền tảng.',
  },
  {
    icon: '💡',
    title: 'Giáo dục',
    description:
      'Lấy giáo dục làm trọng tâm, truyền cảm hứng cho thế hệ trẻ về giá trị di sản văn hóa dân tộc.',
  },
]

const CoreValues = () => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
      {coreValues.map((value, index) => (
        <div key={index} className='bg-white border rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow h-full'>
          <div className='text-4xl mb-4 text-center' aria-hidden='true'>{value.icon}</div>
          <h3 className='text-xl font-bold mb-3 text-center text-heritage-dark'>{value.title}</h3>
          <p className='text-justify'>{value.description}</p>
        </div>
      ))}
    </div>
  )
}

export default CoreValues
