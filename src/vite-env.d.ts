/// <reference types="vite/client" />
/// <reference types="google.maps" />
interface ImportMetaEnv {
  readonly VITE_GOOGLE_MAPS_API: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
