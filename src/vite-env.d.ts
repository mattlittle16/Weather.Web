/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  readonly VITE_GEOCODE_API_KEY: string
  readonly VITE_WEATHER_API_KEY: string
  readonly VITE_WEATHER_REFRESH_INTERVAL_MS: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
