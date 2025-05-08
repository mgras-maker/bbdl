import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/bbdl/', // <-- This line is CRUCIAL for the build output to work on GitHub Pages
})