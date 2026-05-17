/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import * as path from 'path';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';

const injectCssPlugin = () => {
  return {
    name: 'inject-css',
    enforce: 'post',
    generateBundle(options, bundle) {
      for (const key in bundle) {
        const chunk = bundle[key];
        if (chunk.type === 'chunk' && chunk.viteMetadata && chunk.viteMetadata.importedCss) {
          for (const cssId of chunk.viteMetadata.importedCss) {
            const cssAsset = bundle[cssId];
            if (cssAsset && cssAsset.type === 'asset') {
              const css = cssAsset.source.toString().replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '');
              const injectCode = '\ntry{if(typeof document!=="undefined"){const e=document.createElement("style");e.textContent="' + css + '";const target = window.__RUDRA_SHADOW_ROOT__ || document.head; target.appendChild(e);}}catch(err){}\n'; 
              chunk.code += injectCode;
              delete bundle[cssId];
            }
          }
        }
      }
    }
  };
};

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/libs/rudra-core',
  plugins: [
    react(),
    nxViteTsPaths(),
    nxCopyAssetsPlugin(['*.md']),
    dts({
      entryRoot: 'src',
      tsconfigPath: path.join(import.meta.dirname, 'tsconfig.lib.json'),
      pathsToAliases: false,
    }),
    injectCssPlugin(),
  ],
  build: {
    outDir: '../../dist/libs/rudra-core',
    emptyOutDir: true,
    reportCompressedSize: true,
    cssCodeSplit: true, 
    commonjsOptions: { transformMixedEsModules: true },
    lib: {
      entry: 'src/index.ts',
      name: 'rudra-core',
      fileName: 'index',
      formats: ['es' as const],
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'  ],
      output: {
        preserveModules: true, 
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
      },
    },
  },
}));
