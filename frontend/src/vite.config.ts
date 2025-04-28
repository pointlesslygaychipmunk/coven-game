import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/state': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      },
      '/action': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      },
      '/start': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      }
    }
  }
});
