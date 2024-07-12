import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite"
import {  VitePWA } from 'vite-plugin-pwa'
import {ViteImageOptimizer} from "vite-plugin-image-optimizer"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss(),
    VitePWA({
      workbox:{
        maximumFileSizeToCacheInBytes:5000000
      },
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png',"robots.txt"],
      injectRegister:"auto",
      manifest: {
        name: 'たまっぷ',
        short_name: 'たまっぷ', 
        description: '多摩キャン生が開発！法大生のためのバス乗り換えアプリ',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      }
    }),ViteImageOptimizer({
      webp:{
        quality:10,
        
      }
    })
  ],
  base:"./",

})
