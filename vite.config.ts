import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    proxy: {
      '/dooray': {
        target: 'https://api.dooray.com',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/dooray/, ''),
      },
    },
  },
  define: { global: {} },
  build: {
    commonjsOptions: {
      include: [/node_modules/],
      extensions: ['.js', '.cjs'],
      strictRequires: true, // require 구문에 해당 모듈이 없을 경우 에러 발생
      transformMixedEsModules: true, // import와 require문을 함께 사용하는 경우 이를 번들에 포함시키기 위함
    },
  },
});
