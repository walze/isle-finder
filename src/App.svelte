<script lang="ts">
import './App.css';

import { onMount } from 'svelte';
import { parse } from './lib/helpers';
import type { CSVRecord } from './lib/types';

let canvas: HTMLCanvasElement;


const pdata = import('../dataset.csv?raw').then(m => m.default).then(data =>
  parse<CSVRecord>(data).map((r, index) => ({
    price: +r.Member_number / 100,
    name: r.itemDescription,
    index,
  }))
);


onMount(() => {
  import('./lib/pixi').then((p) => p.startPixi(canvas));
});
</script>

<h1 class="text-3xl font-bold underline">
  Hello world!
</h1>

{#await pdata}
	<p>loading...</p>
{:then data}
<ul>
	{#each data as item}
		<li>{item.name} x {item.price}</li>
	{/each}
</ul>
{/await}

<canvas bind:this={canvas} />
