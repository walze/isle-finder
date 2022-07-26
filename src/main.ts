import App from './App.svelte';
import { assert } from './lib/helpers';

const target = document.querySelector('#app');
assert(target, 'No app element found');

const app = new App({
  target,
});

export default app;
