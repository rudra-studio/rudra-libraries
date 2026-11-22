/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import * as path from 'path';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/libs/common-core',
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
    outDir: '../../dist/libs/common-core',
    emptyOutDir: true,
    reportCompressedSize: true,
    cssCodeSplit: true,
    commonjsOptions: { transformMixedEsModules: true },
    lib: {
      entry: {
      'index': path.resolve(import.meta.dirname, 'src/index.ts'),
      "components/CoreNavbar/styles": path.resolve(import.meta.dirname, "src/components/CoreNavbar/styles.module.scss"),
      "components/FeatureCardGrid/styles": path.resolve(import.meta.dirname, "src/components/FeatureCardGrid/styles.module.scss"),
      "components/HeroBanner/styles": path.resolve(import.meta.dirname, "src/components/HeroBanner/styles.module.scss"),
      "components/SignInCalloutCard/styles": path.resolve(import.meta.dirname, "src/components/SignInCalloutCard/styles.module.scss"),
      "components/StepWalkthroughGrid/styles": path.resolve(import.meta.dirname, "src/components/StepWalkthroughGrid/styles.module.scss")
    },
      name: 'common-core',
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
