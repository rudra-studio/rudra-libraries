/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import * as path from 'path';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/libs/rudra-layout',
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
    outDir: '../../dist/libs/rudra-layout',
    emptyOutDir: true,
    reportCompressedSize: true,
    cssCodeSplit: true,
    commonjsOptions: { transformMixedEsModules: true },
    lib: {
      entry: {
      'index': path.resolve(import.meta.dirname, 'src/index.ts'),
      "components/AspectRatio/styles": path.resolve(import.meta.dirname, "src/components/AspectRatio/styles.module.scss"),
      "components/Box/styles": path.resolve(import.meta.dirname, "src/components/Box/styles.module.scss"),
      "components/Carousel/styles": path.resolve(import.meta.dirname, "src/components/Carousel/styles.module.scss"),
      "components/Container/styles": path.resolve(import.meta.dirname, "src/components/Container/styles.module.scss"),
      "components/DataCarousel/styles": path.resolve(import.meta.dirname, "src/components/DataCarousel/styles.module.scss"),
      "components/Flex/styles": path.resolve(import.meta.dirname, "src/components/Flex/styles.module.scss"),
      "components/Grid/styles": path.resolve(import.meta.dirname, "src/components/Grid/styles.module.scss"),
      "components/Repeater/styles": path.resolve(import.meta.dirname, "src/components/Repeater/styles.module.scss"),
      "components/RepeaterTable/styles": path.resolve(import.meta.dirname, "src/components/RepeaterTable/styles.module.scss"),
      "components/ScrollArea/styles": path.resolve(import.meta.dirname, "src/components/ScrollArea/styles.module.scss"),
      "components/Section/styles": path.resolve(import.meta.dirname, "src/components/Section/styles.module.scss"),
      "components/Stack/styles": path.resolve(import.meta.dirname, "src/components/Stack/styles.module.scss"),
      "components/StructuredGrid/styles": path.resolve(import.meta.dirname, "src/components/StructuredGrid/styles.module.scss"),
      "components/Table/styles": path.resolve(import.meta.dirname, "src/components/Table/styles.module.scss"),
      "components/VirtualList/styles": path.resolve(import.meta.dirname, "src/components/VirtualList/styles.module.scss")
    },
      name: 'rudra-layout',
      fileName: 'index',
      formats: ['es' as const],
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime', 'clsx', 'gsap', 'tailwindcss', 'lucide-react', 'motion', 'motion/react', 'framer-motion', 'three', '@react-three/fiber', '@react-three/fiber', '@monaco-editor/react', '@tanstack/react-table'],
      output: {
		preserveModules: true,
		preserveModulesRoot: 'src',
		entryFileNames: '[name].js',
		assetFileNames: '[name][extname]',
      },
    },
  },
}));
