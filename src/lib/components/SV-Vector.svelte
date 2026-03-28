<script lang="ts">
	import { onMount } from 'svelte';
	import { getMagnitude, getAngle, toRecordFormat, snap } from '../physics-engine.js';
	import SVComponentLine from './SV-ComponentLine.svelte';

	/**
	 * SV-Vector — Interactive 2D physics vector component.
	 * 
	 * @prop {Object} pos - Bindable {x, y} relative position of the vector tip.
	 * @prop {number} mag - Bindable magnitude (calculated for lab manuals).
	 * @prop {number} angle - Bindable angle in degrees (0-360).
	 */

	let {
		pos = $bindable({ x: 0, y: 0 }),
		x = $bindable(0),
		y = $bindable(0),
		mag = $bindable(0),
		angle = $bindable(0),
		originX = $bindable(400),
		originY = $bindable(225),
		color = '#3b82f6',
		label = 'Vector',
		step = 10,
		initialMag = 100,
		initialAngle = 0,
		showComponents = false,
		showTooltip = true,
		showOriginHandle = false,
		disableTip = false,
		disableOrigin = false,
		width = 3,
		bounds = { minX: 0, minY: 0, maxX: 1000, maxY: 600 }
	} = $props();

	// Interaction State
	let dragType: 'tip' | 'origin' | null = $state(null);
	let groupRef: SVGGElement | null = $state(null);

	// Tip coordinates (Source of Truth)
	let relativeX = $state(x || pos.x || 0);
	let relativeY = $state(y || pos.y || 0);

	// Multi-way Synchronization
	$effect(() => {
		// Sync internal state to props
		x = relativeX;
		y = relativeY;
		pos = { x: relativeX, y: relativeY };
		
		mag = toRecordFormat(getMagnitude({ x: relativeX, y: relativeY }));
		angle = toRecordFormat(getAngle({ x: relativeX, y: relativeY }));
	});

	// External propulsion (if props change from outside)
	$effect(() => {
		relativeX = x;
		relativeY = y;
	});

	onMount(() => {
		if (pos.x === 0 && pos.y === 0) {
			relativeX = initialMag * Math.cos((initialAngle * Math.PI) / 180);
			relativeY = initialMag * Math.sin((initialAngle * Math.PI) / 180);
		} else {
			relativeX = pos.x;
			relativeY = pos.y;
		}

		console.log(
			'%c @stepvista/core · SV-Vector v1.2.4 ',
			'background: #0f172a; color: #10b981; font-weight: bold; padding: 4px 10px; border-radius: 4px;'
		);
	});

	function translateCoords(event: MouseEvent | TouchEvent) {
		if (!groupRef) return null;
		const svg = groupRef.ownerSVGElement;
		if (!svg) return null;

		const clientX = 'touches' in event ? event.touches[0].clientX : (event as MouseEvent).clientX;
		const clientY = 'touches' in event ? event.touches[0].clientY : (event as MouseEvent).clientY;

		const point = svg.createSVGPoint();
		point.x = clientX;
		point.y = clientY;

		const ctm = svg.getScreenCTM();
		if (!ctm) return null;
		
		const { x, y } = point.matrixTransform(ctm.inverse());
		return { x, y };
	}

	function handleStart(type: 'tip' | 'origin', e: MouseEvent | TouchEvent) {
		if (type === 'tip' && disableTip) return;
		if (type === 'origin' && disableOrigin) return;
		e.stopPropagation();
		dragType = type;
	}

	function handleMove(event: MouseEvent | TouchEvent) {
		if (!dragType) return;

		const coords = translateCoords(event);
		if (!coords) return;

		// Interaction Clamping (Board Guardrails)
		const clampedX = Math.max(bounds.minX, Math.min(bounds.maxX, coords.x));
		const clampedY = Math.max(bounds.minY, Math.min(bounds.maxY, coords.y));

		if (dragType === 'tip') {
			relativeX = snap(clampedX - originX, step);
			relativeY = snap(clampedY - originY, step);
		} else if (dragType === 'origin') {
			originX = snap(clampedX, step);
			originY = snap(clampedY, step);
		}
	}

	function handleEnd() {
		dragType = null;
	}

	function handleKeyDown(type: 'tip' | 'origin', e: KeyboardEvent) {
		if (type === 'tip' && disableTip) return;
		if (type === 'origin' && disableOrigin) return;
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			dragType = dragType === type ? null : type;
		}
	}
</script>

<svelte:window 
	onmousemove={handleMove} 
	onmouseup={handleEnd} 
	ontouchmove={handleMove} 
	ontouchend={handleEnd} 
/>

<g bind:this={groupRef} class="sv-vector select-none" style="font-family: 'Inter', sans-serif;">
	<defs>
		<marker
			id="arrowhead-{color.replace('#', '')}"
			markerWidth="10"
			markerHeight="7"
			refX="9"
			refY="3.5"
			orient="auto"
		>
			<polygon points="0 0, 10 3.5, 0 7" fill={color} />
		</marker>
	</defs>

	<!-- Component Visualization (Dashed Projections) -->
	{#if showComponents}
		<SVComponentLine 
			{originX} 
			{originY} 
			x={relativeX} 
			y={relativeY} 
			{color} 
		/>
	{/if}

	<line
		x1={originX}
		y1={originY}
		x2={originX + relativeX}
		y2={originY + relativeY}
		stroke={color}
		stroke-width={width}
		stroke-linecap="round"
		marker-end="url(#arrowhead-{color.replace('#', '')})"
	/>

	<!-- Interaction Surfaces -->
	<line
		x1={originX} y1={originY} 
		x2={originX + relativeX} y2={originY + relativeY}
		stroke="transparent"
		stroke-width="24"
		style="pointer-events: auto; cursor: move;"
		role="button"
		tabindex="0"
		aria-label="Drag vector body"
		onmousedown={(e) => handleStart('tip', e)}
		ontouchstart={(e) => handleStart('tip', e)}
	/>

	<circle
		cx={originX + relativeX}
		cy={originY + relativeY}
		r="8"
		fill={color}
		fill-opacity="0.3"
		stroke={color}
		stroke-width="2"
		style="pointer-events: auto; cursor: move;"
		role="button"
		tabindex="0"
		aria-label="Vector tip handle"
		onmousedown={(e) => handleStart('tip', e)}
		ontouchstart={(e) => handleStart('tip', e)}
		onkeydown={(e) => handleKeyDown('tip', e)}
	/>

	{#if showOriginHandle}
		<circle
			cx={originX}
			cy={originY}
			r="12"
			fill="#ffffff"
			fill-opacity="0.6"
			stroke="#94a3b8"
			stroke-width="1.5"
			stroke-dasharray="2,2"
			style="pointer-events: auto; cursor: crosshair;"
			role="button"
			tabindex="0"
			aria-label="Vector origin handle"
			onmousedown={(e) => handleStart('origin', e)}
			ontouchstart={(e) => handleStart('origin', e)}
			onkeydown={(e) => handleKeyDown('origin', e)}
		/>
	{/if}

</g>

<style>
	.sv-vector {
		pointer-events: none;
	}
	/* Ensure direct interaction elements are always enabled */
	.sv-vector line, .sv-vector circle {
		pointer-events: auto;
	}
</style>
