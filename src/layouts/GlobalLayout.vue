<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Scrollbar } from 'vue-amazing-ui'
// 显式值导入不经过 VueAmazingUIResolver，不会自动注入组件样式，需手动引入样式入口
import 'vue-amazing-ui/es/scrollbar/style'
import type { ItemType, MenuKey } from 'vue-amazing-ui'
import pkg from 'vue-amazing-ui/package.json'
import ThemeColorButton from './components/ThemeColorButton.vue'
import ThemeModeButton from './components/ThemeModeButton.vue'
import { demoComponentCount, demoGroups } from '@/views/config'
import '@/views/demo.global.less'

const route = useRoute()
const router = useRouter()

const basePath = ''

/** 侧边菜单数据：按分组组织，key 即目标路由 path */
const menuItems = computed<ItemType[]>(
  () =>
    demoGroups.map((group) => ({
      key: `group-${group.title}`,
      label: group.title,
      type: 'group',
      children: group.components.map((component) => ({
        key: `${basePath}/${component.key}`,
        label: `${component.name} ${component.title}`
      }))
    })) as ItemType[]
)

/** 当前选中项跟随路由 */
const selectedKeys = computed<MenuKey[]>(() => [route.path])

/** 默认展开全部分组，用户也可手动折叠 */
const openKeys = ref<MenuKey[]>(demoGroups.map((group) => `group-${group.title}`))

function onSelect(info: { key: MenuKey }) {
  const path = String(info.key)
  if (path !== route.path) {
    router.push(path)
  }
}

/**
 * 少数演示页需要验证「随文档滚动」的行为（水印页的全屏水印 fixed 差异）：
 * 由 index.ts 的 windowScroll 声明，此时不套 Scrollbar，滚动交回文档，侧栏吸附视口顶部
 */
const windowScroll = computed<boolean>(() => route.meta.windowScroll === true)
/** 内容滚动容器：整页滚动页退化为普通 div，避免两套滚动并存 */
const contentWrapper = computed(() => (windowScroll.value ? 'div' : Scrollbar))
const contentScrollRef = ref<InstanceType<typeof Scrollbar> | null>(null)
/** 内容区滚动由 Scrollbar 承载（路由的 scrollBehavior 只作用于 window，管不到它），故路由变化后手动复位 */
watch(
  () => route.fullPath,
  () => {
    contentScrollRef.value?.scrollTo({ top: 0 })
  },
  { flush: 'post' }
)

/** 外壳自带 BackTop 的排除项由各演示页的 index.ts 声明（backTop: false），与官方演示工程一致 */
const hideBackTop = computed(() => route.meta.backTop === false)
</script>

<template>
  <Row class="demo-row" :class="{ 'demo-row-window': windowScroll }">
    <Col class="demo-menu-col" :class="{ 'demo-menu-col-window': windowScroll }" :xs="5" :xl="4">
      <div class="demo-menu-header">
        <div class="demo-menu-title-row">
          <!-- 标题即首页入口：菜单里没有首页项，靠这里回到总览页 -->
          <RouterLink class="demo-menu-title" to="/" title="返回组件总览">Vue Amazing UI</RouterLink>
          <Tag class="demo-menu-version" size="small" color="volcano" :bordered="false">v{{ pkg.version }}</Tag>
        </div>
        <span class="demo-menu-count">共 {{ demoComponentCount }} 个组件</span>
      </div>
      <Scrollbar class="demo-menu-scroll">
        <Menu
          class="demo-menu"
          mode="inline"
          :items="menuItems"
          :selected-keys="selectedKeys"
          :open-keys="openKeys"
          @select="onSelect"
        />
      </Scrollbar>
    </Col>
    <Col class="demo-content-col" :xs="19" :xl="20">
      <component :is="contentWrapper" ref="contentScrollRef" class="demo-content-scroll">
        <div class="router-view">
          <RouterView v-slot="{ Component }">
            <Transition name="fade" mode="out-in">
              <component :is="Component" v-if="Component" />
              <div v-else class="demo-overview">
                <h1>Vue Amazing UI 组件演示</h1>
                <p class="u-intro">
                  左侧菜单选择组件，进入对应演示页核验功能、样式、联动与布局；全部演示页均通过 unplugin-vue-components +
                  VueAmazingUIResolver 自动按需引入组件。
                </p>
                <Row :gutter="[16, 16]">
                  <Col v-for="group in demoGroups" :key="group.title" :xs="24" :sm="12" :lg="8">
                    <Card :title="group.title" size="small">
                      <Space wrap>
                        <RouterLink
                          v-for="component in group.components"
                          :key="component.key"
                          :to="`${basePath}/${component.key}`"
                        >
                          <Tag>{{ component.name }}</Tag>
                        </RouterLink>
                      </Space>
                    </Card>
                  </Col>
                </Row>
              </div>
            </Transition>
          </RouterView>
          <!-- 与官方演示工程一致：暗黑模式浮钮（bottom: 160）在最上、主题色浮钮（bottom: 100）居中、
               BackTop（默认 bottom: 40）在下；三者都靠固定定位落在右下角，因此放在滚动内容内即可
               （BackTop 会自动监听最近的可滚动祖先） -->
          <ThemeModeButton />
          <ThemeColorButton />
          <BackTop v-if="!hideBackTop" />
        </div>
      </component>
    </Col>
  </Row>
</template>

<style lang="less" scoped>
// 整行撑满视口高度，作为两列高度的唯一声明源（Row 为 wrap 容器，交叉轴 stretch 无法压低列高，故列高以 100% 派生）
.demo-row {
  height: 100vh;
  // 整页滚动页：高度交由内容撑开，侧栏改为吸附视口（见 .demo-menu-col-window）
  &-window {
    height: auto;
    align-items: flex-start;
  }
}

// 整页滚动页的侧栏：吸附视口顶部并撑满一屏，内容随文档滚动
.demo-menu-col-window {
  position: sticky;
  top: 0;
  align-self: flex-start;
  height: 100vh;
}

// 左侧菜单列：纵向弹性布局，头部固定 + 菜单区占满剩余高度
.demo-menu-col {
  display: flex;
  flex-direction: column;
  height: 100%;
  border-right: 1px solid var(--va-border-color);
}

.demo-menu-header {
  flex: none;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 16px 16px 12px;
  border-bottom: 1px solid var(--va-border-color);
}

// 标题行：组件库名（渐变）+ 版本标签；flex-start 顶对齐，标签不做垂直居中
.demo-menu-title-row {
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 6px;
}

// 版本标签上移，落在标题右上角形成角标观感（小尺寸标签行盒与标题行盒高度接近，仅顶对齐几乎看不出差异）
.demo-menu-version {
  margin-top: -4px;
}

.demo-menu-title {
  font-size: 18px;
  font-weight: 600;
  // 渐变文字：与演示页 h1 共用 demo.global.less 中的 --demo-title-gradient
  background-image: var(--demo-title-gradient);
  -webkit-background-clip: text;
  background-clip: text;
  // 同时是回首页的链接（RouterLink → a），这里压掉全局链接色，保留渐变文字
  color: transparent;
  text-decoration: none;
  // 悬停 / 键盘聚焦时给出「可点击」的反馈
  transition: opacity 0.2s;
  &:hover,
  &:focus-visible {
    opacity: 0.75;
  }
}

.demo-menu-count {
  font-size: 12px;
  color: var(--va-text-color-3);
}

// 菜单滚动区：占满剩余高度，交由 Scrollbar 组件接管滚动
.demo-menu-scroll {
  flex: 1;
  min-height: 0;
}

.demo-menu {
  width: 100%;
  border-inline-end: none;
}

// 右侧内容列：高度由 .demo-row 派生；min-width: 0 防止长内容撑破 flex 布局
.demo-content-col {
  height: 100%;
  min-width: 0;
}

// 内容区滚动：撑满列高，交由 Scrollbar 组件接管滚动
.demo-content-scroll {
  height: 100%;
}

// 内容区内边距（对齐官方演示工程 .router-view 约定）
.router-view {
  padding: 36px;
}

// 路由切换淡入淡出（对齐官方演示工程）
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.demo-overview {
  max-width: 1200px;
}
</style>
