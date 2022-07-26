<script lang="ts">
import { onMount } from 'svelte';
import { parse } from './lib/helpers';
import type { CSVRecord } from './lib/types';

let canvas: HTMLCanvasElement;


import('../dataset.csv?raw').then(m => m.default).then(data =>
  parse<CSVRecord>(data).map((r, index) => ({
    price: +r.Member_number / 100,
    name: r.itemDescription,
    index,
  }))
).then(console.log);


onMount(() => {
  import('./lib/pixi').then((p) => p.startPixi(canvas));
});
</script>

<canvas bind:this={canvas} />
