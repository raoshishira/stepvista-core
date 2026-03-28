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
	<!-- X-Axis Solid Component (The "Shadow" on X) -->
	<line
		x1={originX}
		y1={originY}
		x2={tipX}
		y2={originY}
		stroke={color}
		stroke-width="3.5"
		stroke-opacity="0.8"
		stroke-linecap="round"
	/>

	<!-- Y-Axis Solid Component (The "Shadow" on Y) -->
	<line
		x1={originX}
		y1={originY}
		x2={originX}
		y2={tipY}
		stroke={color}
		stroke-width="3.5"
		stroke-opacity="0.4"
		stroke-linecap="round"
	/>

	<!-- Vertical Projection (to Tip) -->
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

	<!-- Horizontal Projection (to Tip) -->
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
