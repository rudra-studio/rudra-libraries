/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import * as path from 'path';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/libs/common-three',
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
    outDir: '../../dist/libs/common-three',
    emptyOutDir: true,
    reportCompressedSize: true,
    cssCodeSplit: true,
    commonjsOptions: { transformMixedEsModules: true },
    lib: {
      entry: {
      'index': path.resolve(import.meta.dirname, 'src/index.ts'),
      "components/OrbitStage3D/styles": path.resolve(import.meta.dirname, "src/components/OrbitStage3D/styles.module.scss"),
      "components/PolyhedronShowcase3D/styles": path.resolve(import.meta.dirname, "src/components/PolyhedronShowcase3D/styles.module.scss"),
      "components/SpatialCard3D/styles": path.resolve(import.meta.dirname, "src/components/SpatialCard3D/styles.module.scss"),
      "components/TorusKnotStage3D/styles": path.resolve(import.meta.dirname, "src/components/TorusKnotStage3D/styles.module.scss"),
      "components/TurntableArena3D/styles": path.resolve(import.meta.dirname, "src/components/TurntableArena3D/styles.module.scss"),
      "components/VoxelGridStage3D/styles": path.resolve(import.meta.dirname, "src/components/VoxelGridStage3D/styles.module.scss")
    },
      name: 'common-three',
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
