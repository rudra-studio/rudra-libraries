/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import * as path from 'path';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/libs/rudra-games-kit',
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
    outDir: '../../dist/libs/rudra-games-kit',
    emptyOutDir: true,
    reportCompressedSize: true,
    cssCodeSplit: true,
    commonjsOptions: { transformMixedEsModules: true },
    lib: {
      entry: {
      'index': path.resolve(import.meta.dirname, 'src/index.ts'),
      "components/ConnectFourBoard/styles": path.resolve(import.meta.dirname, "src/components/ConnectFourBoard/styles.module.scss"),
      "components/GameArenaHeader/styles": path.resolve(import.meta.dirname, "src/components/GameArenaHeader/styles.module.scss"),
      "components/MemoryMatchGrid/styles": path.resolve(import.meta.dirname, "src/components/MemoryMatchGrid/styles.module.scss"),
      "components/NumberSlideBoard/styles": path.resolve(import.meta.dirname, "src/components/NumberSlideBoard/styles.module.scss"),
      "components/ReactionReflexPad/styles": path.resolve(import.meta.dirname, "src/components/ReactionReflexPad/styles.module.scss"),
      "components/TicTacToeBoard/styles": path.resolve(import.meta.dirname, "src/components/TicTacToeBoard/styles.module.scss")
    },
      name: 'rudra-games-kit',
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
