/// <reference types="vite/client" />

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const Component: DefineComponent<object, object, unknown>
  export default Component
}
