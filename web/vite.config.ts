import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3000',
        changeOrigin: true,

        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req) => {
            const previewAuthorization =
              req.headers['x-rpg-authorization']

            if (
              typeof previewAuthorization !== 'string' ||
              !previewAuthorization.startsWith('Bearer ')
            ) {
              return
            }

            proxyReq.setHeader(
              'Authorization',
              previewAuthorization,
            )

            proxyReq.removeHeader(
              'x-rpg-authorization',
            )
          })
        },
      },
    },
  },
})
