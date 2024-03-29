import { assert } from './lib/helpers';

const target = document.querySelector('#app');
assert(target, 'No app element found');

import('./App.svelte').then(({ default: App }) => {
  const app = new App({
    target,
  });

  return app;
});
