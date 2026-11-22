/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import * as path from 'path';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/libs/common-navigation',
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
    outDir: '../../dist/libs/common-navigation',
    emptyOutDir: true,
    reportCompressedSize: true,
    cssCodeSplit: true,
    commonjsOptions: { transformMixedEsModules: true },
    lib: {
      entry: {
      'index': path.resolve(import.meta.dirname, 'src/index.ts'),
      "components/BreadcrumbTrail/styles": path.resolve(import.meta.dirname, "src/components/BreadcrumbTrail/styles.module.scss"),
      "components/NavBar/styles": path.resolve(import.meta.dirname, "src/components/NavBar/styles.module.scss"),
      "components/PaginationBar/styles": path.resolve(import.meta.dirname, "src/components/PaginationBar/styles.module.scss"),
      "components/SideNav/styles": path.resolve(import.meta.dirname, "src/components/SideNav/styles.module.scss"),
      "components/StepperBar/styles": path.resolve(import.meta.dirname, "src/components/StepperBar/styles.module.scss"),
      "components/TabStrip/styles": path.resolve(import.meta.dirname, "src/components/TabStrip/styles.module.scss")
    },
      name: 'common-navigation',
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
