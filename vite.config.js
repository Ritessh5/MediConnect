import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // CORRECTED PATH: Pointing to the 'services' folder where api.js resides
      '@api': path.resolve(__dirname, 'src/frontend/services'), 
    },
  },
  server: {
    fs: {
      // Keep your file system allowances
      allow: [
        'C:/Users/Dell/OneDrive/Desktop/Web Programming Lab/MediConnect/',
        'C:/Users/Dell/node_modules',
      ],
    },
  },
});