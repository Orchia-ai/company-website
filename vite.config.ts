import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// Local E2E target for the video funnel and manager proxies. Vercel functions
// read the same name; production falls back to https://alpha.lingyizhou.com.
// On this Mac the Alpha backend runs locally on 3210 via launchd.
const VSA_BACKEND_URL = (process.env.VSA_BACKEND_URL ?? 'http://127.0.0.1:3210').replace(/\/$/, '')

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    proxy: {
      // Canonical links in public API responses derive from x-forwarded-host,
      // so player/status links keep pointing at this dev server.
      '/api/public': {
        target: VSA_BACKEND_URL,
        changeOrigin: false,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req) => {
            proxyReq.setHeader('x-forwarded-host', req.headers.host ?? 'localhost:5173')
            proxyReq.setHeader('x-forwarded-proto', 'http')
          })
        },
      },
      // Auth mutations need a trusted browser Origin; the BFF presents one.
      // In dev the backend trusts the hardcoded DEVELOPMENT_ORIGINS list
      // (better-auth resolves trusted origins without request context), so a
      // list member is used here; production uses the backend's brand origin.
      '/api/auth': {
        target: VSA_BACKEND_URL,
        changeOrigin: false,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req) => {
            if (req.method === 'POST') {
              proxyReq.setHeader('origin', 'http://localhost:3210')
              proxyReq.removeHeader('sec-fetch-site')
              proxyReq.removeHeader('sec-fetch-mode')
              proxyReq.removeHeader('sec-fetch-dest')
              proxyReq.removeHeader('referer')
            }
          })
        },
      },
      '/api/manager/public-projects': {
        target: VSA_BACKEND_URL,
        rewrite: (path) => path.replace(/^\/api\/manager\/public-projects/, '/api/admin/public-agent-projects'),
      },
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        print: resolve(__dirname, 'print.html'),
      },
    },
  },
})
