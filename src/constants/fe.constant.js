let BASE_URL = ''
if (import.meta.env.VITE_BUILD_MODE === 'dev')
    BASE_URL = 'http://localhost:8017/v1'
// console.log('Build mode:', import.meta.env.VITE_BUILD_MODE)
if (import.meta.env.VITE_BUILD_MODE === 'production')
    BASE_URL = 'https://heritage.thuandev.id.vn/v1'
// console.log('BASE_URL:', BASE_URL)
export { BASE_URL }
