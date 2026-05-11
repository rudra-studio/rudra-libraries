/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import * as path from 'path';
import * as fs from 'fs';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

// This recursively maps every file in 'src' to be its own standalone entry point
function getEntries(dir) {
  const entries = {};
  function traverse(currentDir) {
    const files = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const file of files) {
      const fullPath = path.join(currentDir, file.name);
      if (file.isDirectory()) {
        traverse(fullPath);
      } else if (file.name.endsWith('.ts') || file.name.endsWith('.tsx')) {
        if (!file.name.endsWith('.d.ts')) {
          const relativePath = path.relative(dir, fullPath);
          const name = relativePath.replace(/\.tsx?$/, '');
          entries[name] = fullPath;
        }
      }
    }
  }
  traverse(dir);
  return entries;
}

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
    cssInjectedByJsPlugin(),
  ],
  build: {
    outDir: '../../dist/libs/rudra-core',
    emptyOutDir: true,
    reportCompressedSize: true,
    
    // 1. Force CSS splitting
    cssCodeSplit: true, 

    commonjsOptions: { transformMixedEsModules: true },
    
    // 2. BRING BACK LIBRARY MODE! 
    lib: {
      // 3. Feed the dynamic multi-entry object directly into lib.entry
      entry: getEntries(path.resolve(import.meta.dirname, 'src')),
      formats: ['es'],
    },
    
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'  ],
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]',
      },
    },
  },
}));
