/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PEXELS_API_KEY: string
  readonly GEMINI_API_KEY: string
  readonly API_KEY: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

