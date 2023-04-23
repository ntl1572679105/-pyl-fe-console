import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
import {
  createStyleImportPlugin,
  AndDesignVueResolve,
  AntdResolve,
} from 'vite-plugin-style-import';
import { resolve } from 'path';
import alias from '@rollup/plugin-alias'; // 注意，如果不加这个的话，alias不生效

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  server: {
    port: 8222,
    proxy: {
      '/api': {
        target: 'http://test.chuangjisu.com',
        changeOrigin: true,
        // pathRewrite: {
        //   '^/cmp': '',
        // }
      },
    },
  },
  resolve: {
    alias: [
      { find: '@', replacement: resolve(__dirname, 'src') },
      { find: /^~/, replacement: '' },
    ],
  },
  plugins: [
    vue(),
    alias(), // 注意这里
    Components({
      resolvers: [AntDesignVueResolver()],
    }),
    createStyleImportPlugin({
      resolvers: [AndDesignVueResolve(), AntdResolve()],
      libs: [
        {
          libraryName: 'ant-design-vue',
          esModule: true,
          resolveStyle: (name) => {
            return `ant-design-vue/es/${name}/style/index`;
          },
        },
      ],
    }),
  ],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        modifyVars: {
          'primary-color': '#1890FF',
          'link-color': '#1890FF',
          'border-radius-base': '2px',
        },
      },
    },
  },
  esbuild: {
    loader: 'jsx',
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
  build: {
    brotliSize: false /* 压缩大型输出文件可能会很慢，因此禁用该功能可能会提高大型项目的构建性能 */,
    outDir: 'dist' /* 指定输出路径 */,
    cssCodeSplit: false /* 整个项目中的所有 CSS 将被提取到一个 CSS 文件中 */,
    chunkSizeWarningLimit: 1500 /* chunk 大小警告的限制（以 kbs 为单位） */,
    sourcemap: false /* 构建后是否生成 source map 文件 */,
    manifest: false /* 当设置为 true，构建后将会生成 manifest.json 文件，包含了没有被 hash 过的资源文件名和 hash 后版本的映射  */,
    // assetsDir: 'static/img/' /* 指定生成静态资源的存放路径 */,
    emptyOutDir: true /* 默认情况下，若 outDir 在 root 目录下，则 Vite 会在构建时清空该目录 */,
    rollupOptions: {
      output: {
        chunkFileNames: 'static/js/[name].[hash].js',
        entryFileNames: 'static/js/[name].[hash].js',
        assetFileNames: 'static/assets/[name].[hash].[ext]',
        // assetFileNames: 'static/[ext]/[name].[hash].[ext]',
      },
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        // 生产环境移除 console
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
});
