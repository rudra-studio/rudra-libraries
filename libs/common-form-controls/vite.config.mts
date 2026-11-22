/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import * as path from 'path';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/libs/common-form-controls',
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
    outDir: '../../dist/libs/common-form-controls',
    emptyOutDir: true,
    reportCompressedSize: true,
    cssCodeSplit: true,
    commonjsOptions: { transformMixedEsModules: true },
    lib: {
      entry: {
      'index': path.resolve(import.meta.dirname, 'src/index.ts'),
      "components/ChoiceChipGroup/styles": path.resolve(import.meta.dirname, "src/components/ChoiceChipGroup/styles.module.scss"),
      "components/DateInputField/styles": path.resolve(import.meta.dirname, "src/components/DateInputField/styles.module.scss"),
      "components/FormSectionCard/styles": path.resolve(import.meta.dirname, "src/components/FormSectionCard/styles.module.scss"),
      "components/RatingStarsField/styles": path.resolve(import.meta.dirname, "src/components/RatingStarsField/styles.module.scss"),
      "components/SearchInputBox/styles": path.resolve(import.meta.dirname, "src/components/SearchInputBox/styles.module.scss")
    },
      name: 'common-form-controls',
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
