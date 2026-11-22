/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import * as path from 'path';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/libs/common-charts',
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
    outDir: '../../dist/libs/common-charts',
    emptyOutDir: true,
    reportCompressedSize: true,
    cssCodeSplit: true,
    commonjsOptions: { transformMixedEsModules: true },
    lib: {
      entry: {
      'index': path.resolve(import.meta.dirname, 'src/index.ts'),
      "components/AreaChart/styles": path.resolve(import.meta.dirname, "src/components/AreaChart/styles.module.scss"),
      "components/BarChart/styles": path.resolve(import.meta.dirname, "src/components/BarChart/styles.module.scss"),
      "components/DonutChart/styles": path.resolve(import.meta.dirname, "src/components/DonutChart/styles.module.scss"),
      "components/GaugeChart/styles": path.resolve(import.meta.dirname, "src/components/GaugeChart/styles.module.scss"),
      "components/LineChart/styles": path.resolve(import.meta.dirname, "src/components/LineChart/styles.module.scss"),
      "components/PieChart/styles": path.resolve(import.meta.dirname, "src/components/PieChart/styles.module.scss"),
      "components/ProgressRing/styles": path.resolve(import.meta.dirname, "src/components/ProgressRing/styles.module.scss"),
      "components/RadarChart/styles": path.resolve(import.meta.dirname, "src/components/RadarChart/styles.module.scss"),
      "components/ScatterChart/styles": path.resolve(import.meta.dirname, "src/components/ScatterChart/styles.module.scss"),
      "components/SparklineChart/styles": path.resolve(import.meta.dirname, "src/components/SparklineChart/styles.module.scss"),
      "components/StatCard/styles": path.resolve(import.meta.dirname, "src/components/StatCard/styles.module.scss"),
      "components/TimelineView/styles": path.resolve(import.meta.dirname, "src/components/TimelineView/styles.module.scss")
    },
      name: 'common-charts',
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
