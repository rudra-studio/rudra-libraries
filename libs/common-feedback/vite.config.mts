/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import * as path from 'path';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/libs/common-feedback',
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
    outDir: '../../dist/libs/common-feedback',
    emptyOutDir: true,
    reportCompressedSize: true,
    cssCodeSplit: true,
    commonjsOptions: { transformMixedEsModules: true },
    lib: {
      entry: {
      'index': path.resolve(import.meta.dirname, 'src/index.ts'),
      "components/AlertBanner/styles": path.resolve(import.meta.dirname, "src/components/AlertBanner/styles.module.scss"),
      "components/EmptyStateCard/styles": path.resolve(import.meta.dirname, "src/components/EmptyStateCard/styles.module.scss"),
      "components/ModalDialog/styles": path.resolve(import.meta.dirname, "src/components/ModalDialog/styles.module.scss"),
      "components/SlideDrawer/styles": path.resolve(import.meta.dirname, "src/components/SlideDrawer/styles.module.scss"),
      "components/StatusBadge/styles": path.resolve(import.meta.dirname, "src/components/StatusBadge/styles.module.scss"),
      "components/ToastBar/styles": path.resolve(import.meta.dirname, "src/components/ToastBar/styles.module.scss"),
      "components/TooltipBox/styles": path.resolve(import.meta.dirname, "src/components/TooltipBox/styles.module.scss")
    },
      name: 'common-feedback',
      fileName: 'index',
      formats: ['es' as const],
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime', 'clsx'],
      output: {
		preserveModules: true,
		preserveModulesRoot: 'src',
		entryFileNames: '[name].js',
		assetFileNames: '[name][extname]',
      },
    },
  },
}));
