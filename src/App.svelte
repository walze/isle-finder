<script lang="ts">
import { onMount } from 'svelte';

let canvas: HTMLCanvasElement;

onMount(() => {
  import('./lib/pixi').then((p) => p.startPixi(canvas));
});
</script>

<canvas bind:this={canvas} />
