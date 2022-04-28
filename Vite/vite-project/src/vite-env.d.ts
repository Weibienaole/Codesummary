/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  // 自定义环境变量
  readonly VITE_IMG_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// 声明之后在 .env 中创建
// 通过 import.meta.env. + VITE_[自定义的变量] 进行访问
// example: import.meta.env.VITE_IMAGE_BASE_URL
