/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import * as path from 'path';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/libs/common-layout-containers',
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
    outDir: '../../dist/libs/common-layout-containers',
    emptyOutDir: true,
    reportCompressedSize: true,
    cssCodeSplit: true,
    commonjsOptions: { transformMixedEsModules: true },
    lib: {
      entry: {
      'index': path.resolve(import.meta.dirname, 'src/index.ts'),
      "components/ContainerBox/styles": path.resolve(import.meta.dirname, "src/components/ContainerBox/styles.module.scss"),
      "components/GridLayout/styles": path.resolve(import.meta.dirname, "src/components/GridLayout/styles.module.scss"),
      "components/SectionFrame/styles": path.resolve(import.meta.dirname, "src/components/SectionFrame/styles.module.scss"),
      "components/SplitPaneLayout/styles": path.resolve(import.meta.dirname, "src/components/SplitPaneLayout/styles.module.scss"),
      "components/StackLayout/styles": path.resolve(import.meta.dirname, "src/components/StackLayout/styles.module.scss"),
      "components/SurfaceCard/styles": path.resolve(import.meta.dirname, "src/components/SurfaceCard/styles.module.scss")
    },
      name: 'common-layout-containers',
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
