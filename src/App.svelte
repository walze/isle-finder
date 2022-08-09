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
    pairwise,
    reduce,
    take,
    toArray,
  } from 'rxjs';
  import { slots$ } from './lib/listing';
  import { astar } from './lib/astar';
  import {
    calcPath,
    gridGet,
    startNode,
    grid,
  } from './lib/grid';
  import { assert } from './lib/helpers';
  import type { Node } from './lib/types';
  import { pair } from 'ramda';
  import shuffleArray from 'shuffle-array';

  let canvas: HTMLCanvasElement;
  let search = '';
  const slots = slots$.pipe(toArray());

  onMount(async () => {
    const { startPixi } = await import('./lib/pixi');

    startPixi(canvas);
  });

  $: total = from($cart.values()).pipe(
    reduce((n, item) => n + item, ''),
    // map((n) => n.toFixed(2)),
  );

  $: data = getData().pipe(
    mergeMap(identity),
    filter(
      (p) => p.name?.includes(search) && !$cart.has(p.name),
    ),
    take($slots.length),
    toArray(),
    map((data) => shuffleArray(data)),
  );

  $: f = (a: Node | number): number => {
    return typeof a === 'number'
      ? a
      : astar([...$grid])([startNode, a]).length;
  };

  $: paths = [...$cart.values()]
    .map((p) => $slots.find(([name]) => name === p))
    .map((a) => {
      assert(a, 'product not found');

      return a[1];
    })
    .sort((a, b) => f(gridGet(a)($grid)) - f(gridGet(b)($grid)));

  $: from([pair(0, 0), ...paths])
    .pipe(
      // skip(paths.length - 1),
      map(gridGet),
      map((f) => f($grid)),
      pairwise(),
      calcPath,
    )
    .subscribe(console.warn);

  $: console.log(123, gridGet([1, 2])($grid));
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
        on:click={() => {
          cart.next(new Set($cart.add(item.name)));
        }}
      >
        {item.name} - ${item.price}
      </li>
    {/each}
  </ul>

  <canvas bind:this={canvas} />
</main>
