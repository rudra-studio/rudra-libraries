/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import * as path from 'path';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/libs/mui-components',
  plugins: [
    react(),
    nxViteTsPaths(),
    nxCopyAssetsPlugin(['*.md']),
    dts({
      entryRoot: 'src',
      tsconfigPath: path.join(import.meta.dirname, 'tsconfig.lib.json'),
      pathsToAliases: false,
    }),
  ],
  build: {
    outDir: '../../dist/libs/mui-components',
    emptyOutDir: true,
    reportCompressedSize: true,
    cssCodeSplit: true,
    commonjsOptions: { transformMixedEsModules: true },
    lib: {
      entry: {
      'index': path.resolve(import.meta.dirname, 'src/index.ts'),
      "components/Alert/styles": path.resolve(import.meta.dirname, "src/components/Alert/styles.module.scss"),
      "components/Button/styles": path.resolve(import.meta.dirname, "src/components/Button/styles.module.scss"),
      "components/Checkbox/styles": path.resolve(import.meta.dirname, "src/components/Checkbox/styles.module.scss"),
      "components/Dialog/styles": path.resolve(import.meta.dirname, "src/components/Dialog/styles.module.scss"),
      "components/Select/styles": path.resolve(import.meta.dirname, "src/components/Select/styles.module.scss"),
      "components/Switch/styles": path.resolve(import.meta.dirname, "src/components/Switch/styles.module.scss"),
      "components/TextField/styles": path.resolve(import.meta.dirname, "src/components/TextField/styles.module.scss")
    },
      name: 'mui-components',
      fileName: 'index',
      formats: ['es' as const],
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime', 'clsx', '@mui/material', '@mui/system', '@mui/icons-material', '@mui/x-date-pickers', '@emotion/react', '@emotion/styled', 'dayjs'],
      output: {
		preserveModules: true,
		preserveModulesRoot: 'src',
		entryFileNames: '[name].js',
		assetFileNames: '[name][extname]',
      },
    },
  },
}));
