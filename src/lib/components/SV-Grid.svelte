<script lang="ts">
  let { size = 50, color = "#e5e7eb", opacity = 0.5 } = $props();
</script>

<svg class="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="grid" width={size} height={size} patternUnits="userSpaceOnUse">
      <path d="M {size} 0 L 0 0 0 {size}" fill="none" stroke={color} stroke-width="1" stroke-opacity={opacity} />
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#grid)" />
</svg>
