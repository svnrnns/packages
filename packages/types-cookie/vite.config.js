import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: 'lib/index.ts',
      fileName: (format) => `types-cookie.${format === 'es' ? 'js' : 'cjs'}`,
      formats: ['es', 'cjs'],
    },
  },
  plugins: [
    dts({
      insertTypesEntry: true,
      outDir: 'dist',
      entryRoot: 'lib',
    }),
  ],
  test: {
    environment: 'happy-dom', // Use Happy DOM instead of jsdom
    globals: true, // Enable global test functions (describe, it, expect)
    setupFiles: ['./tests/setup.ts'], // Optional setup file
  },
});
