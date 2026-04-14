import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/setupTests.js'],
    css: false,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'clover'],
      exclude: [
        'node_modules/',
        'src/setupTests.js',
        'vitest.config.js',
        'vite.config.js',
        '**/*.test.{js,jsx}',
        '**/__tests__/**',
      ],
      thresholds: {
        statements: 70,
        branches: 70,
        functions: 70,
        lines: 70,
      },
    },
    include: ['src/**/*.test.{js,jsx}'],
    exclude: ['node_modules', 'dist'],
  },
});