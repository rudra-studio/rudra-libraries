// libs/my-ui-lib/vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

export default defineConfig({
  plugins: [react(), nxViteTsPaths()],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'MyUiLib', // The global variable name for the CDN build
      fileName: 'index',
      formats: ['es', 'cjs', 'umd'], // Ensure 'umd' is here for jsDelivr
    },
    rollupOptions: {
      external: ['react', 'react-dom'], // Don't bundle React itself
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    }
  }
});
