import 'dotenv/config'

export const env = {
    BUILD_MODE: process.env.BUILD_MODE,
    WEBSITE_DOMAIN_DEVELOPMENT: process.env.WEBSITE_DOMAIN_DEVELOPMENT,
    WEBSITE_DOMAIN_PRODUCTION: process.env.WEBSITE_DOMAIN_PRODUCTION
}