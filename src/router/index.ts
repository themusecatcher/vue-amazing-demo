import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const APP_TITLE = 'Vue Amazing Demo'

/*
  vue-amazing-ui 组件演示路由（编译时收集，新增演示页无需手写路由）
  约定：src/views/<kebab-case>/Index.vue 为演示页，index.ts 默认导出路由 meta
  路由 path 由目录推导：/button、/config-provider；
  name 转 PascalCase（短横线分段各自首字母大写）：Button、ConfigProvider
*/
const demoComponents = import.meta.glob('../views/*/Index.vue')
const demoMetas = import.meta.glob('../views/*/index.ts', {
  eager: true, // 直接引入模块
  import: 'default' // 加载默认导出
})
const demoRoutes: RouteRecordRaw[] = Object.entries(demoMetas).map(([path, meta]) => {
  const componentPath = path.replace('index.ts', 'Index.vue') // 打包过后目录结构不存在，不能用该变量直接作为组件导入路径
  // 去掉前导斜杠：子路由 path 必须是相对路径，若以 '/' 开头会被视为绝对路径、丢失父级前缀
  const routePath = path.replace('../views', '').replace('/index.ts', '').replace(/^\//, '') // button、config-provider
  // 路径转 PascalCase 作为路由 name（短横线分段各自首字母大写，如 config-provider → ConfigProvider），
  // 不加前缀，演示页标题 {{ $route.name }} 直接展示组件名；filter(Boolean) 去掉多余斜杠导致的空字符串
  const name = routePath
    .split('/')
    .filter(Boolean)
    .map((word) =>
      word
        .split('-')
        .filter(Boolean)
        .map((part) => `${part[0]?.toUpperCase() ?? ''}${part.slice(1)}`)
        .join('')
    )
    .join('')
  return {
    path: routePath,
    name,
    meta,
    component: demoComponents[componentPath]
  } as RouteRecordRaw
})

export const routes: RouteRecordRaw[] = [
  {
    // 入口直达组件演示区：/ 为演示外壳（左侧组件菜单 + 右侧演示内容）
    path: '/',
    name: 'Index',
    meta: { title: '组件库演示' },
    component: () => import('@/layouts/GlobalLayout.vue'),
    children: demoRoutes
  },
  {
    path: '/:pathMatch(.*)*',
    // 演示站定位单一，未知路径统一回到演示区，不再单独维护 404 页面
    redirect: '/'
  }
]

const router = createRouter({
  /**
   * 路由器使用的历史记录模式。大多数应用应该使用 createWebHistory，但这需要正确配置服务器。
   * 你也可以使用 createWebHashHistory 来实现基于 hash 的历史记录，但这种方式不会被搜索引擎处理，SEO 的效果较差。
   */
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    // 滚动行为
    return { left: 0, top: 0, behavior: 'smooth' }
  }
})

// 注册全局前置守卫 (to, from) => {}
router.beforeEach((to) => {
  const domTitle = to.meta.title
  document.title = domTitle ? `${domTitle} - ${APP_TITLE}` : APP_TITLE
})

export default router
