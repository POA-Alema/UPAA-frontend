import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react'; // Adicione esta linha
import path from 'node:path';

export default defineConfig({
  plugins: [react()], // Adicione esta linha
  test: {
    environment: 'jsdom', // Mude de 'node' para 'jsdom'
    globals: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
