<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useThemeStore } from '@/stores/theme'

// 主题种子与明暗模式取自 theme store，右下角 FloatButton 的面板修改后全站组件配色实时联动
const themeStore = useThemeStore()
const route = useRoute()
// 与官方演示工程一致：整站包一层页面级水印（水印演示页自身展示水印，排除在外避免叠加）
const routeName = computed(() => route.name)
</script>

<template>
  <!-- 同时验证 vue-amazing-ui 的 Provider 架构：ConfigProvider 主题 + LoadingBar/Message/Modal/Dialog/Notification -->
  <!-- abstract 显式传 true：演示站有大量 Teleport 到 body 的浮层与页面链接，只有写 <html> 才能让它们跟随主题 -->
  <ConfigProvider :theme="themeStore.theme" :abstract="true">
    <LoadingBarProvider>
      <MessageProvider>
        <ModalProvider>
          <DialogProvider>
            <NotificationProvider>
              <RouterView v-if="routeName === 'Watermark'" />
              <Watermark v-else content="Vue Amazing UI">
                <RouterView />
              </Watermark>
            </NotificationProvider>
          </DialogProvider>
        </ModalProvider>
      </MessageProvider>
    </LoadingBarProvider>
  </ConfigProvider>
</template>
