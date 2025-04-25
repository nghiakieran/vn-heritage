let BASE_URL = ''
console.log('env', import.meta.env)
if (import.meta.env.BUILD_MODE === 'dev')
    BASE_URL = import.meta.env.WEBSITE_DOMAIN_DEVELOPMENT
if (import.meta.env.BUILD_MODE === 'production')
    BASE_URL = import.meta.env.WEBSITE_DOMAIN_PRODUCTION
export { BASE_URL }