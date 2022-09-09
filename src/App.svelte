<script lang="ts">
  import './App.css';

  import { onMount } from 'svelte';
  import getData from './dataset';
  import { cart } from './stores';
  import {
    filter,
    from,
    map,
    mergeAll,
    pairwise,
    reduce,
    take,
    toArray,
  } from 'rxjs';
  import { slots$ } from './lib/listing';
  import { manhattan } from './lib/astar';
  import { calcPath, startNode } from './lib/grid';
  import { assert$ } from './lib/helpers';
  import shuffleArray from 'shuffle-array';

  let canvas: HTMLCanvasElement;
  let search = '';
  const slots = slots$.pipe(toArray());
  const source = mergeAll()(getData());

  onMount(async () => {
    import('./lib/pixi').then(({ startPixi: f }) => f(canvas));
  });

  $: data = source.pipe(
    filter(
      (p) => p.name?.includes(search) && !$cart.has(p.name),
    ),
    take($slots?.length - 1),
    toArray(),
    map((data) => shuffleArray(data)),
  );

  $: total = source.pipe(
    filter((p) => $cart.has(p.name)),
    reduce((acc, p) => acc + p.price, 0),
    map((p) => p.toFixed(2)),
  );

  $: paths = from($cart).pipe(
    map((p) => $slots.find(([name]) => name === p)),
    assert$(),
    map(([, slot]) => slot),
    toArray(),
    map((xs) =>
      xs.sort(
        ([ax, ay], [bx, by]) =>
          manhattan(startNode.px - ax, startNode.py - ay) -
          manhattan(startNode.px - bx, startNode.py - by),
      ),
    ),
  );

  $: from([startNode.coords, ...$paths])
    .pipe(pairwise(), calcPath)
    .subscribe((_) => {
      // _.map((n) => console.log(n.coords));
    });
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
