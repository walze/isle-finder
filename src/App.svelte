<script lang="ts">
  import './App.css';

  import { onMount } from 'svelte';
  import getData from './dataset';
  import { cart } from './stores';
  import {
    filter,
    from,
    identity,
    map,
    mergeAll,
    mergeMap,
    of,
    pairwise,
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
  import { assert$ } from './lib/helpers';
  import { pair } from 'ramda';
  // import shuffleArray from 'shuffle-array';

  let canvas: HTMLCanvasElement;
  let search = '';
  const slots = slots$.pipe(toArray());
  const source = getData();

  onMount(async () => {
    const { startPixi } = await import('./lib/pixi');

    startPixi(canvas);
  });

  $: data = source.pipe(
    mergeMap(identity),
    filter(
      (p) => p.name?.includes(search) && !$cart.has(p.name),
    ),
    take($slots?.length),
    toArray(),
    // map((data) => shuffleArray(data)),
  );

  $: total = $source
    ?.filter((p) => $cart.has(p.name))
    .reduce((acc, p) => acc + p.price, 0)
    .toFixed(2);

  $: paths = of($cart).pipe(
    mergeAll(),
    map((p) => $slots.find(([name]) => name === p)),
    assert$('Product not found'),
    map(([, slot]) => slot),
    toArray(),
    map((xs) =>
      xs.sort(
        (a, b) =>
          astar([startNode, gridGet(a)($grid)])($grid).length -
          astar([startNode, gridGet(b)($grid)])($grid).length,
      ),
    ),
  );

  $: from([pair(0, 0), ...($paths || [])])
    .pipe(
      map((c) => gridGet(c)($grid)),
      pairwise(),
      calcPath($grid),
    )
    .subscribe(console.warn);

  $: console.log(123, gridGet([1, 2])($grid), $paths);
</script>

<main class="container mx-auto">
  <h1 class="my-8 text-4xl">The Isle Finder</h1>

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
    total: ${total}
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
