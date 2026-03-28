<script lang="ts">
  import { getMagnitude, crossProduct, projectTo2D, getParallelogramPoints, type Vector } from '../physics-engine';

  let { 
    v1 = { x: 0, y: 0, z: 0 }, 
    v2 = { x: 0, y: 0, z: 0 }, 
    originX = 0, 
    originY = 0, 
    color = '#3b82f6' 
  }: { 
    v1: Vector, 
    v2: Vector, 
    originX: number, 
    originY: number, 
    color: string 
  } = $props();

  // Visibility logic: Area is physically relevant only above the "Zen Buffer"
  let isVisible = $derived(getMagnitude(crossProduct(v1, v2)) > 0.05);

  // Project 3D vertices to 2D SVG points
  let pointsString = $derived.by(() => {
    const vertices = getParallelogramPoints(v1, v2);
    return vertices
      .map(v => {
        const projected = projectTo2D(v);
        return `${originX + projected.x},${originY + projected.y}`;
      })
      .join(' ');
  });
</script>

{#if isVisible}
  <g class="sv-parallelogram-group pointer-events-none transition-opacity duration-500">
    <polygon
      points={pointsString}
      fill={color}
      fill-opacity="0.15"
      stroke={color}
      stroke-width="1.5"
      stroke-dasharray="4,4"
      stroke-opacity="0.5"
      class="animate-in fade-in duration-700"
    />
  </g>
{/if}

<style>
  .sv-parallelogram-group {
    /* Blueprint depth: ensure it sits behind vectors but above the grid */
    z-index: 5;
  }
</style>
