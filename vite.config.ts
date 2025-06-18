import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: 'https://ashiwin-14.github.io/tools/',
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});

