import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { VueAmazingUIResolver } from 'vue-amazing-ui'

/**
 * 本项目唯一职责：在「第三方项目」场景下验证 vue-amazing-ui 的可用性。
 * 因此只保留验证链路必需的最小配置：
 * - @vitejs/plugin-vue：SFC 编译
 * - unplugin-auto-import：Vue / Vue Router / Pinia API 自动按需导入
 * - unplugin-vue-components + VueAmazingUIResolver：组件按需引入 + 样式副作用注入（验证重点）
 */
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia']
    }),
    Components({
      resolvers: [
        VueAmazingUIResolver({
          cjs: false
        })
      ]
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: true,
    // 固定端口，被占用时直接报错而不是静默换端口，避免误判验证结果
    port: 9090,
    strictPort: true,
    open: true
  },
  preview: {
    port: 9090
  }
})
