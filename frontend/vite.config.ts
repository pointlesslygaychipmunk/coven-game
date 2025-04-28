import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/state': {
        target: 'http://localhost:3001',
        changeOrigin: true
      },
      '/action': {
        target: 'http://localhost:3001',
        changeOrigin: true
      },
      '/start': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  }
});
