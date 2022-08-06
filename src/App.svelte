<script lang="ts">
  import './App.css';

  import { onMount } from 'svelte';
  import { getData } from './dataset';
  import { cart } from './stores';
  import { toArray } from 'rxjs';
  import { slots$ } from './lib/listing';

  let canvas: HTMLCanvasElement;
  let search = '';

  const slots = slots$.pipe(toArray());

  onMount(() => {
    import('./lib/pixi').then((p) => p.startPixi(canvas));
  });

  $: total = [...$cart.values()]
    .reduce((n, item) => n + item.price, 0)
    .toFixed(2);

  const data = getData();
</script>

<main class="container mx-auto">
  <input
    class="text-xl"
    type="text"
    bind:value={search}
    placeholder="search"
  />

  <h1 class="text-3xl mb-2 mt-1">
    total: ${total}
  </h1>

  <ul class="overflow-scroll max-h-60">
    {#each $data
      .filter((d) => d.name?.includes(search) && !$cart.get(d.name))
      .slice(0, $slots.length) as item}
      <li
        class="hover:bg-slate-100 cursor-pointer hover:font-bold"
        on:click={() => cart.next($cart.set(item.name, item))}
      >
        {item.name} - ${item.price}
      </li>
    {/each}
  </ul>

  <canvas bind:this={canvas} />
</main>
