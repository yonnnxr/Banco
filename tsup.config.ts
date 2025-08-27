import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/public/script.ts'],
  format: ['iife'],
  globalName: 'BancoDigital',
  outDir: 'src/public',
  clean: false,
  minify: true,
  sourcemap: true,
  target: 'es2020',
  bundle: true,
  external: [],
  noExternal: [],
  treeshake: true,
  splitting: false,
  dts: false,
  onSuccess: 'echo "Build completed successfully!"',
});
