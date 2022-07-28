<script lang="ts">
  import './App.css';

  import { onMount, onDestroy } from 'svelte';
  import { getData } from './dataset';
  import { cart$ } from './stores';
  import { lastValueFrom } from 'rxjs';

  let canvas: HTMLCanvasElement;
  let search = '';

  let cart = cart$.getValue();
  cart$.subscribe((c) => (cart = c));
  onDestroy(console.warn);

  onMount(() => {
    import('./lib/pixi').then((p) => p.startPixi(canvas));
  });

  $: total = [...cart.values()]
    .reduce((n, item) => n + item.price, 0)
    .toFixed(2);
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

  {#await lastValueFrom(getData())}
    <p>loading...</p>
  {:then data}
    <ul class="overflow-scroll max-h-60">
      {#each data.filter((d) => d.name?.includes(search) && !cart.get(d.name)) as item}
        <li
          class="hover:bg-slate-100 cursor-pointer hover:font-bold"
          on:click={() => cart$.next(cart.set(item.name, item))}
        >
          {item.name} - ${item.price}
        </li>
      {/each}
    </ul>
  {/await}

  <canvas bind:this={canvas} />
</main>
