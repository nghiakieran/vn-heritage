import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'security-headers',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          // Content Security Policy với frame-ancestors
          res.setHeader(
            'Content-Security-Policy',
            "default-src 'self'; " +
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://maps.googleapis.com https://www.gstatic.com; " +
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
            "font-src 'self' https://fonts.gstatic.com; " +
            "img-src 'self' data: blob: https: http:; " +
            "connect-src 'self' https://localhost:8017 wss://localhost:8017 https://heritage.thuandev.id.vn wss://heritage.thuandev.id.vn https://maps.googleapis.com; " +
            "frame-src 'self' https://www.google.com; " +
            "frame-ancestors 'none'; " +
            "object-src 'none'; " +
            "base-uri 'self'; " +
            "form-action 'self'; " +
            "upgrade-insecure-requests;"
          )
          
          // Anti-clickjacking headers (double protection)
          res.setHeader('X-Frame-Options', 'DENY')
          
          // HSTS Header - KHẮC PHỤC LỖI STRICT-TRANSPORT-SECURITY
          res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
          
          // Additional security headers
          res.setHeader('X-Content-Type-Options', 'nosniff')
          res.setHeader('X-XSS-Protection', '1; mode=block')
          res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
          res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()')
          
          next()
        })
      }
    }
  ],
  resolve: {
    alias: [
      { find: '~', replacement: '/src' }
    ]
  },
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'cert/key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, 'cert/cert.pem'))
    },
    host: '0.0.0.0',
    port: 5173
  }
})
