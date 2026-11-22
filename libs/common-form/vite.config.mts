/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import * as path from 'path';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/libs/common-form',
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
    outDir: '../../dist/libs/common-form',
    emptyOutDir: true,
    reportCompressedSize: true,
    cssCodeSplit: true,
    commonjsOptions: { transformMixedEsModules: true },
    lib: {
      entry: {
      'index': path.resolve(import.meta.dirname, 'src/index.ts'),
      "components/CheckboxGroup/styles": path.resolve(import.meta.dirname, "src/components/CheckboxGroup/styles.module.scss"),
      "components/DragDropMatchingQuestion/styles": path.resolve(import.meta.dirname, "src/components/DragDropMatchingQuestion/styles.module.scss"),
      "components/FormContainer/styles": path.resolve(import.meta.dirname, "src/components/FormContainer/styles.module.scss"),
      "components/MultiChoiceQuestion/styles": path.resolve(import.meta.dirname, "src/components/MultiChoiceQuestion/styles.module.scss"),
      "components/RadioGroupField/styles": path.resolve(import.meta.dirname, "src/components/RadioGroupField/styles.module.scss"),
      "components/SelectField/styles": path.resolve(import.meta.dirname, "src/components/SelectField/styles.module.scss"),
      "components/TextAreaField/styles": path.resolve(import.meta.dirname, "src/components/TextAreaField/styles.module.scss"),
      "components/TextInputField/styles": path.resolve(import.meta.dirname, "src/components/TextInputField/styles.module.scss"),
      "components/ToggleSwitchField/styles": path.resolve(import.meta.dirname, "src/components/ToggleSwitchField/styles.module.scss")
    },
      name: 'common-form',
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
