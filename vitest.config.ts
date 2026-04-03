import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()], // Habilita o processamento de componentes React
  test: {
    environment: 'jsdom', // Essencial para renderizar componentes
    globals: true,
    setupFiles: './vitest.setup.ts', // Aponta para o arquivo que você criou no passo 1
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});