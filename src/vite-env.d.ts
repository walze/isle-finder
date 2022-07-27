/// <reference types="svelte" />
/// <reference types="vite/client" />

declare module '*.csv' {
  const classes: any;
  export default classes;
}

declare module '*?raw' {
  const classes: any;
  export default classes;
}
