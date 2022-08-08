<script lang="ts">
  import './App.css';

  import { onMount } from 'svelte';
  import { getData } from './dataset';
  import { cart } from './stores';
  import {
    filter,
    from,
    identity,
    map,
    mergeMap,
    reduce,
    take,
    toArray,
  } from 'rxjs';
  import { slots$ } from './lib/listing';
  import { astar } from './lib/astar';
  import { grid, gridGet, startNode } from './lib/grid';
  import { assert } from './lib/helpers';
  import type { Node } from './lib/types';

  let canvas: HTMLCanvasElement;
  let search = '';
  const slots = slots$.pipe(toArray());

  onMount(async () => {
    const { startPixi } = await import('./lib/pixi');

    startPixi(canvas);
  });

  $: total = from($cart.values()).pipe(
    reduce((n, item) => n + item.price, 0),
    map((n) => n.toFixed(2)),
  );

  $: data = getData().pipe(
    mergeMap(identity),
    filter(
      (p) => p.name?.includes(search) && !$cart.has(p.name),
    ),
    take($slots.length),
    toArray(),
    // map((data) => shuffle(data)),
  );

  const f = (a: Node | number): number => {
    return typeof a === 'number'
      ? a
      : astar(grid.value)([startNode, a]).length;
  };

  $: asd = [...$cart.values()]
    .map((p) => $slots.find(([name]) => name === p.name))
    .map((a) => {
      assert(a, 'product not found');

      return a[1];
    })
    .sort((a, b) => {
      console.warn(a, b);

      return (
        f(gridGet(grid.value)(a)) - f(gridGet(grid.value)(b))
      );
    });

  $: console.log(
    asd,
    // astar(grid.value)([startNode, gridGet(grid.value)([0, 11])]),
  );
  $: console.log($slots.length, $data.length);
</script>

<main class="container mx-auto">
  {#if !$data}
    <h2 class="text-8xl text-center my-20">loading...</h2>
  {/if}

  <input
    class="text-xl my-4 p-3"
    type="search"
    bind:value={search}
    placeholder="search"
  />

  <h2 class="text-3xl mb-2 mt-1">
    total: ${$total}
  </h2>

  <ul class="overflow-scroll max-h-60">
    {#each $data || [] as item}
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
