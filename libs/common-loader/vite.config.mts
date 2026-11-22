/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import * as path from 'path';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/libs/common-loader',
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
    outDir: '../../dist/libs/common-loader',
    emptyOutDir: true,
    reportCompressedSize: true,
    cssCodeSplit: true,
    commonjsOptions: { transformMixedEsModules: true },
    lib: {
      entry: {
      'index': path.resolve(import.meta.dirname, 'src/index.ts'),
      "components/LoadingOverlay/styles": path.resolve(import.meta.dirname, "src/components/LoadingOverlay/styles.module.scss"),
      "components/ProgressBar/styles": path.resolve(import.meta.dirname, "src/components/ProgressBar/styles.module.scss"),
      "components/PulseDots/styles": path.resolve(import.meta.dirname, "src/components/PulseDots/styles.module.scss"),
      "components/ShimmerCard/styles": path.resolve(import.meta.dirname, "src/components/ShimmerCard/styles.module.scss"),
      "components/Skeleton/styles": path.resolve(import.meta.dirname, "src/components/Skeleton/styles.module.scss"),
      "components/Spinner/styles": path.resolve(import.meta.dirname, "src/components/Spinner/styles.module.scss")
    },
      name: 'common-loader',
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
