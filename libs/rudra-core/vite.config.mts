/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import * as path from 'path';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';

// ---> THE CUSTOM INJECTOR PLUGIN <---
// This grabs the split CSS and natively injects it into the matching JS chunk
const injectCssPlugin = () => {
  return {
    name: 'inject-css',
    enforce: 'post',
    generateBundle(options, bundle) {
      for (const key in bundle) {
        const chunk = bundle[key];
        // Find chunks that imported a CSS file
        if (chunk.type === 'chunk' && chunk.viteMetadata && chunk.viteMetadata.importedCss) {
          for (const cssId of chunk.viteMetadata.importedCss) {
            const cssAsset = bundle[cssId];
            if (cssAsset && cssAsset.type === 'asset') {
              // Convert the CSS to a safe string
              const css = cssAsset.source.toString().replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '');
              // Create the injection logic
              const injectCode = '\ntry{if(typeof document!=="undefined"){const e=document.createElement("style");e.textContent="' + css + '";document.head.appendChild(e);}}catch(err){}\n';
              // Append to the JS file
              chunk.code += injectCode;
              // Delete the standalone CSS file
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
    injectCssPlugin(), // <-- USE OUR CUSTOM PLUGIN
  ],
  build: {
    outDir: '../../dist/libs/rudra-core',
    emptyOutDir: true,
    reportCompressedSize: true,
    
    // 1. Force Vite to split the CSS per-component
    cssCodeSplit: true, 
    commonjsOptions: { transformMixedEsModules: true },
    
    // 2. RESTORE LIBRARY MODE (Keeps React code from being deleted)
    lib: {
      entry: 'src/index.ts',
      name: 'rudra-core',
      fileName: 'index',
      formats: ['es' as const],
    },
    
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'  ],
      output: {
        // 3. RESTORE PRESERVE MODULES (Outputs components/Button/index.js)
        preserveModules: true, 
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
      },
    },
  },
}));
