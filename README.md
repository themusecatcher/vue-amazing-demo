# vue-amazing-demo

_vue-amazing-ui 组件库第三方使用验证站：逐组件核验功能、样式、按需引入与主题联动_

## 定位

本仓库唯一职责：**在独立于组件库源码的「第三方项目」环境中验证 `vue-amazing-ui` 是否可正常使用**，用于排查引入方式、样式注入、组件行为、类型声明等层面的错漏。

验证覆盖点：

- `unplugin-vue-components` + `VueAmazingUIResolver` 自动按需引入（含样式副作用注入）
- 组件库 `Provider` 架构（`ConfigProvider` / `Message` / `Modal` / `Dialog` / `Notification` / `LoadingBar`）
- 右下角常驻 FloatButton 实时切换主题色，校验 `ConfigProvider` 全局主题联动
- 各组件在真实页面布局、数据、联动场景下的功能与样式表现

## 技术栈

Vue 3 + TypeScript + Vite + Vue Router + Pinia + Less，样式预处理器只保留 Less（不使用 Sass）。

## 目录约定

```
src/
├── main.ts              # 应用入口（含全局基础样式引入）
├── App.vue              # Provider 层 + 主题配置
├── router/index.ts      # 演示路由（import.meta.glob 编译时收集）
├── stores/theme.ts      # 全局主题色（唯一数据源）
├── assets/less/global.less
├── layouts/
│   └── GlobalLayout.vue # 演示区外壳：左侧分组菜单 + 右下角主题色 FloatButton + 右侧 RouterView
└── views/
    ├── config.ts        # 演示页清单（导航菜单数据源，新增组件需在此登记）
    ├── demo.global.less # 演示区全局样式（仅演示区路由挂载期间生效）
    └── <kebab-case>/
        ├── Index.vue    # 演示页
        └── index.ts     # 路由 meta（title）
```

新增演示页只需新增目录并在 `views/config.ts` 登记，路由无需手写。访问 `/` 即为演示区概览页，未知路径同样回到演示区。

## 常用命令

```sh
pnpm install       # 安装依赖
pnpm dev           # 开发（固定 9090 端口）
pnpm build         # 生产构建
pnpm preview       # 构建并本地预览（9090 端口）
pnpm type-check    # 类型检查
pnpm lint          # ESLint 自动修复
pnpm check         # lint + 格式 + 类型一次跑完
```

## 升级组件库

```sh
pnpm add vue-amazing-ui@latest
pnpm dev    # 逐页核对演示，必要时同步调整演示页
```

## References

- [Vue Amazing UI 组件库](https://themusecatcher.github.io/vue-amazing-ui/)
- [Vue3 文档](https://cn.vuejs.org/guide/introduction)
