/**
 * Chuyển bất kỳ giá trị ngày nào sang định dạng YYYY-MM-DD
 * Dùng được cho cả string, Date object, hoặc timestamp
 * Trả về chuỗi '' nếu input không hợp lệ
 */
export function toDateInputFormat(date) {
  if (!date) return ''
  try {
    return new Date(date).toISOString().split('T')[0]
  // eslint-disable-next-line no-unused-vars
  } catch (error) {
    console.error('Invalid date format:', date)
    return ''
  }
}
