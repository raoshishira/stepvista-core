<script lang="ts">
  import { spring } from 'svelte/motion';
  
  let { direction = 'none' } = $props(); // 'out' | 'in' | 'none'
  let lastDirection = 'none';

  // Spring for the "Pop" effect
  const iconScale = spring(1, {
    stiffness: 0.2,
    damping: 0.4
  });

  // Trigger the "Pop" whenever direction changes
  $effect(() => {
    if (direction !== 'none' && direction !== lastDirection) {
      iconScale.set(1.4).then(() => iconScale.set(1));
    }
    lastDirection = direction;
  });
</script>

<div class="sv-z-indicator flex items-center justify-center w-12 h-12 transition-all duration-300"
     style="transform: scale({$iconScale}); opacity: {direction === 'none' ? 0 : 1}">
  
  {#if direction === 'out'}
    <svg viewBox="0 0 24 24" class="w-10 h-10 text-indigo-600 drop-shadow-md">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
    </svg>
  {:else if direction === 'in'}
    <svg viewBox="0 0 24 24" class="w-10 h-10 text-rose-600 drop-shadow-md rotate-45">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2" />
      <path d="M12 7v10M7 12h10" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
    </svg>
  {/if}
</div>

<style>
  /* Optional: Add a subtle 'thump' sound-effect feel with a keyframe if needed */
  svg {
    transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
</style>
