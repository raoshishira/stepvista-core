<script lang="ts">
	/**
	 * SV-ComponentLine — Visualizes the X and Y components of a vector.
	 * 
	 * @prop {number} originX - SVG origin X.
	 * @prop {number} originY - SVG origin Y.
	 * @prop {number} x - Relative X component (pos.x).
	 * @prop {number} y - Relative Y component (pos.y).
	 * @prop {string} color - Line color (hex).
	 */

	let { 
		originX = 0, 
		originY = 0, 
		x = 0, 
		y = 0, 
		color = '#94a3b8' 
	} = $props();

	// Tip coordinates
	let tipX = $derived(originX + x);
	let tipY = $derived(originY + y);
</script>

<g class="sv-component-lines pointer-events-none">
	<!-- Vertical Component Line (to X-axis) -->
	<line
		x1={tipX}
		y1={tipY}
		x2={tipX}
		y2={originY}
		stroke={color}
		stroke-width="1.5"
		stroke-dasharray="4, 4"
		stroke-opacity="0.6"
	/>

	<!-- Horizontal Component Line (to Y-axis) -->
	<line
		x1={tipX}
		y1={tipY}
		x2={originX}
		y2={tipY}
		stroke={color}
		stroke-width="1.5"
		stroke-dasharray="4, 4"
		stroke-opacity="0.4"
	/>
</g>
