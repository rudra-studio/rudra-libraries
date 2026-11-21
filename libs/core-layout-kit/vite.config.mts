/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import * as path from 'path';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/libs/core-layout-kit',
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
    outDir: '../../dist/libs/core-layout-kit',
    emptyOutDir: true,
    reportCompressedSize: true,
    cssCodeSplit: true,
    commonjsOptions: { transformMixedEsModules: true },
    lib: {
      entry: {
      'index': path.resolve(import.meta.dirname, 'src/index.ts'),
      "components/AppShell/styles": path.resolve(import.meta.dirname, "src/components/AppShell/styles.module.scss"),
      "components/AspectRatio/styles": path.resolve(import.meta.dirname, "src/components/AspectRatio/styles.module.scss"),
      "components/AuthLayout/styles": path.resolve(import.meta.dirname, "src/components/AuthLayout/styles.module.scss"),
      "components/BentoGridLayout/styles": path.resolve(import.meta.dirname, "src/components/BentoGridLayout/styles.module.scss"),
      "components/Box/styles": path.resolve(import.meta.dirname, "src/components/Box/styles.module.scss"),
      "components/Center/styles": path.resolve(import.meta.dirname, "src/components/Center/styles.module.scss"),
      "components/Cluster/styles": path.resolve(import.meta.dirname, "src/components/Cluster/styles.module.scss"),
      "components/Container/styles": path.resolve(import.meta.dirname, "src/components/Container/styles.module.scss"),
      "components/Divider/styles": path.resolve(import.meta.dirname, "src/components/Divider/styles.module.scss"),
      "components/Flex/styles": path.resolve(import.meta.dirname, "src/components/Flex/styles.module.scss"),
      "components/FlexStack/styles": path.resolve(import.meta.dirname, "src/components/FlexStack/styles.module.scss"),
      "components/FullBleedCanvasLayout/styles": path.resolve(import.meta.dirname, "src/components/FullBleedCanvasLayout/styles.module.scss"),
      "components/Grid/styles": path.resolve(import.meta.dirname, "src/components/Grid/styles.module.scss"),
      "components/HolyGrailLayout/styles": path.resolve(import.meta.dirname, "src/components/HolyGrailLayout/styles.module.scss"),
      "components/LayoutContainer/styles": path.resolve(import.meta.dirname, "src/components/LayoutContainer/styles.module.scss"),
      "components/MasterDetailLayout/styles": path.resolve(import.meta.dirname, "src/components/MasterDetailLayout/styles.module.scss"),
      "components/ResponsiveGrid/styles": path.resolve(import.meta.dirname, "src/components/ResponsiveGrid/styles.module.scss"),
      "components/SectionBand/styles": path.resolve(import.meta.dirname, "src/components/SectionBand/styles.module.scss"),
      "components/SingleColumnLayout/styles": path.resolve(import.meta.dirname, "src/components/SingleColumnLayout/styles.module.scss"),
      "components/Spacer/styles": path.resolve(import.meta.dirname, "src/components/Spacer/styles.module.scss"),
      "components/Stack/styles": path.resolve(import.meta.dirname, "src/components/Stack/styles.module.scss"),
      "components/VerticalSpacer/styles": path.resolve(import.meta.dirname, "src/components/VerticalSpacer/styles.module.scss")
    },
      name: 'core-layout-kit',
      fileName: 'index',
      formats: ['es' as const],
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime', 'clsx', 'clsx', 'tailwind-merge', 'class-variance-authority'],
      output: {
		preserveModules: true,
		preserveModulesRoot: 'src',
		entryFileNames: '[name].js',
		assetFileNames: '[name][extname]',
      },
    },
  },
}));
