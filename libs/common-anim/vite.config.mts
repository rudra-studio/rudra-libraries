/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import * as path from 'path';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/libs/common-anim',
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
    outDir: '../../dist/libs/common-anim',
    emptyOutDir: true,
    reportCompressedSize: true,
    cssCodeSplit: true,
    commonjsOptions: { transformMixedEsModules: true },
    lib: {
      entry: {
      'index': path.resolve(import.meta.dirname, 'src/index.ts'),
      "components/FadeRevealBox/styles": path.resolve(import.meta.dirname, "src/components/FadeRevealBox/styles.module.scss"),
      "components/MarqueeStrip/styles": path.resolve(import.meta.dirname, "src/components/MarqueeStrip/styles.module.scss"),
      "components/ParticleDriftStage/styles": path.resolve(import.meta.dirname, "src/components/ParticleDriftStage/styles.module.scss"),
      "components/PulseBeacon/styles": path.resolve(import.meta.dirname, "src/components/PulseBeacon/styles.module.scss"),
      "components/SpriteSheetPlayer/styles": path.resolve(import.meta.dirname, "src/components/SpriteSheetPlayer/styles.module.scss")
    },
      name: 'common-anim',
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
