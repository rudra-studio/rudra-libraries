/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import * as path from 'path';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/libs/smileyyfy-ui',
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
    outDir: '../../dist/libs/smileyyfy-ui',
    emptyOutDir: true,
    reportCompressedSize: true,
    cssCodeSplit: true,
    commonjsOptions: { transformMixedEsModules: true },
    lib: {
      entry: {
      'index': path.resolve(import.meta.dirname, 'src/index.ts'),
      "components/FloatingHeartsCanvas/styles": path.resolve(import.meta.dirname, "src/components/FloatingHeartsCanvas/styles.module.scss"),
      "components/LoveProposalStage/styles": path.resolve(import.meta.dirname, "src/components/LoveProposalStage/styles.module.scss"),
      "components/OccasionTemplateGallery/styles": path.resolve(import.meta.dirname, "src/components/OccasionTemplateGallery/styles.module.scss"),
      "components/PageCanvasBuilder/styles": path.resolve(import.meta.dirname, "src/components/PageCanvasBuilder/styles.module.scss"),
      "components/RsvpParticipantTracker/styles": path.resolve(import.meta.dirname, "src/components/RsvpParticipantTracker/styles.module.scss"),
      "components/SmileyyfyNavbar/styles": path.resolve(import.meta.dirname, "src/components/SmileyyfyNavbar/styles.module.scss"),
      "components/WeddingInviteBuilder/styles": path.resolve(import.meta.dirname, "src/components/WeddingInviteBuilder/styles.module.scss"),
      "components/YouTubeMediaWidget/styles": path.resolve(import.meta.dirname, "src/components/YouTubeMediaWidget/styles.module.scss")
    },
      name: 'smileyyfy-ui',
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
