/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import * as path from 'path';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/libs/custom-portfolio-components',
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
    outDir: '../../dist/libs/custom-portfolio-components',
    emptyOutDir: true,
    reportCompressedSize: true,
    cssCodeSplit: true,
    commonjsOptions: { transformMixedEsModules: true },
    lib: {
      entry: {
      'index': path.resolve(import.meta.dirname, 'src/index.ts'),
      "components/BiographySection/styles": path.resolve(import.meta.dirname, "src/components/BiographySection/styles.module.scss"),
      "components/ContactSection/styles": path.resolve(import.meta.dirname, "src/components/ContactSection/styles.module.scss"),
      "components/HeroSection/styles": path.resolve(import.meta.dirname, "src/components/HeroSection/styles.module.scss"),
      "components/ProfessionalTitle/styles": path.resolve(import.meta.dirname, "src/components/ProfessionalTitle/styles.module.scss"),
      "components/ResumeLink/styles": path.resolve(import.meta.dirname, "src/components/ResumeLink/styles.module.scss"),
      "components/SocialLinks/styles": path.resolve(import.meta.dirname, "src/components/SocialLinks/styles.module.scss")
    },
      name: 'custom-portfolio-components',
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
