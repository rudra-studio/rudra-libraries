/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import * as path from 'path';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/libs/rudra-mui-complete',
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
    outDir: '../../dist/libs/rudra-mui-complete',
    emptyOutDir: true,
    reportCompressedSize: true,
    cssCodeSplit: true,
    commonjsOptions: { transformMixedEsModules: true },
    lib: {
      entry: {
      'index': path.resolve(import.meta.dirname, 'src/index.ts'),
      "components/Accordion/styles": path.resolve(import.meta.dirname, "src/components/Accordion/styles.module.scss"),
      "components/Alert/styles": path.resolve(import.meta.dirname, "src/components/Alert/styles.module.scss"),
      "components/AppBar/styles": path.resolve(import.meta.dirname, "src/components/AppBar/styles.module.scss"),
      "components/Autocomplete/styles": path.resolve(import.meta.dirname, "src/components/Autocomplete/styles.module.scss"),
      "components/Avatar/styles": path.resolve(import.meta.dirname, "src/components/Avatar/styles.module.scss"),
      "components/Backdrop/styles": path.resolve(import.meta.dirname, "src/components/Backdrop/styles.module.scss"),
      "components/Badge/styles": path.resolve(import.meta.dirname, "src/components/Badge/styles.module.scss"),
      "components/Box/styles": path.resolve(import.meta.dirname, "src/components/Box/styles.module.scss"),
      "components/Breadcrumbs/styles": path.resolve(import.meta.dirname, "src/components/Breadcrumbs/styles.module.scss"),
      "components/Button/styles": path.resolve(import.meta.dirname, "src/components/Button/styles.module.scss"),
      "components/Card/styles": path.resolve(import.meta.dirname, "src/components/Card/styles.module.scss"),
      "components/Checkbox/styles": path.resolve(import.meta.dirname, "src/components/Checkbox/styles.module.scss"),
      "components/Chip/styles": path.resolve(import.meta.dirname, "src/components/Chip/styles.module.scss"),
      "components/CircularProgress/styles": path.resolve(import.meta.dirname, "src/components/CircularProgress/styles.module.scss"),
      "components/Container/styles": path.resolve(import.meta.dirname, "src/components/Container/styles.module.scss"),
      "components/Dialog/styles": path.resolve(import.meta.dirname, "src/components/Dialog/styles.module.scss"),
      "components/Divider/styles": path.resolve(import.meta.dirname, "src/components/Divider/styles.module.scss"),
      "components/Drawer/styles": path.resolve(import.meta.dirname, "src/components/Drawer/styles.module.scss"),
      "components/Fab/styles": path.resolve(import.meta.dirname, "src/components/Fab/styles.module.scss"),
      "components/Grid/styles": path.resolve(import.meta.dirname, "src/components/Grid/styles.module.scss"),
      "components/IconButton/styles": path.resolve(import.meta.dirname, "src/components/IconButton/styles.module.scss"),
      "components/LinearProgress/styles": path.resolve(import.meta.dirname, "src/components/LinearProgress/styles.module.scss"),
      "components/List/styles": path.resolve(import.meta.dirname, "src/components/List/styles.module.scss"),
      "components/Menu/styles": path.resolve(import.meta.dirname, "src/components/Menu/styles.module.scss"),
      "components/Pagination/styles": path.resolve(import.meta.dirname, "src/components/Pagination/styles.module.scss"),
      "components/Paper/styles": path.resolve(import.meta.dirname, "src/components/Paper/styles.module.scss"),
      "components/Radio/styles": path.resolve(import.meta.dirname, "src/components/Radio/styles.module.scss"),
      "components/Rating/styles": path.resolve(import.meta.dirname, "src/components/Rating/styles.module.scss"),
      "components/Select/styles": path.resolve(import.meta.dirname, "src/components/Select/styles.module.scss"),
      "components/Skeleton/styles": path.resolve(import.meta.dirname, "src/components/Skeleton/styles.module.scss"),
      "components/Slider/styles": path.resolve(import.meta.dirname, "src/components/Slider/styles.module.scss"),
      "components/Snackbar/styles": path.resolve(import.meta.dirname, "src/components/Snackbar/styles.module.scss"),
      "components/Stack/styles": path.resolve(import.meta.dirname, "src/components/Stack/styles.module.scss"),
      "components/Stepper/styles": path.resolve(import.meta.dirname, "src/components/Stepper/styles.module.scss"),
      "components/Switch/styles": path.resolve(import.meta.dirname, "src/components/Switch/styles.module.scss"),
      "components/Table/styles": path.resolve(import.meta.dirname, "src/components/Table/styles.module.scss"),
      "components/Tabs/styles": path.resolve(import.meta.dirname, "src/components/Tabs/styles.module.scss"),
      "components/TextField/styles": path.resolve(import.meta.dirname, "src/components/TextField/styles.module.scss"),
      "components/Tooltip/styles": path.resolve(import.meta.dirname, "src/components/Tooltip/styles.module.scss"),
      "components/Typography/styles": path.resolve(import.meta.dirname, "src/components/Typography/styles.module.scss")
    },
      name: 'rudra-mui-complete',
      fileName: 'index',
      formats: ['es' as const],
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime', 'clsx', '@mui/material', '@mui/system', '@emotion/react', '@emotion/styled'],
      output: {
		preserveModules: true,
		preserveModulesRoot: 'src',
		entryFileNames: '[name].js',
		assetFileNames: '[name][extname]',
      },
    },
  },
}));
