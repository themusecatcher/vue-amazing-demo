<script setup lang="ts">
import { computed } from 'vue'
import type { ConfigProviderTheme } from 'vue-amazing-ui'
import { useThemeStore } from '@/stores/theme'

// 主题色取自 theme store，右下角 FloatButton 的 ColorPicker 修改后全站组件配色实时联动
const themeStore = useThemeStore()
const theme = computed<ConfigProviderTheme>(() => ({
  common: {
    primaryColor: themeStore.primaryColor
  }
}))
</script>

<template>
  <!-- 同时验证 vue-amazing-ui 的 Provider 架构：ConfigProvider 主题 + LoadingBar/Message/Modal/Dialog/Notification -->
  <ConfigProvider :theme="theme">
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
