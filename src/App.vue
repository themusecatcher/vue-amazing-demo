<script setup lang="ts">
import { useThemeStore } from '@/stores/theme'

// 主题种子与明暗模式取自 theme store，右下角 FloatButton 的面板修改后全站组件配色实时联动
const themeStore = useThemeStore()
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
              <RouterView />
            </NotificationProvider>
          </DialogProvider>
        </ModalProvider>
      </MessageProvider>
    </LoadingBarProvider>
  </ConfigProvider>
</template>
