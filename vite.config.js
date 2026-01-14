import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 443,
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'ssl/certificate .key')),
      cert: fs.readFileSync(path.resolve(__dirname, 'ssl/certificate .crt')),
      ca: fs.readFileSync(path.resolve(__dirname, 'ssl/certificate_ca .crt'))
    },
    strictPort: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    target: 'esnext'
  }
})
