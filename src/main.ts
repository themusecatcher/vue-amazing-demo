import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
// 全局基础样式（reset + body/a + 间距工具类）：统一在此引入一次，确保首屏即生效
import './assets/less/global.less'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.mount('#app')
