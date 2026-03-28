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
		showOriginHandle = false
	} = $props();

	// Interaction State
	let dragType: 'tip' | 'origin' | null = $state(null);
	let groupRef: SVGGElement | null = $state(null);

	// Tip coordinates
	let relativeX = $state(0);
	let relativeY = $state(0);

	onMount(() => {
		if (pos.x === 0 && pos.y === 0) {
			relativeX = initialMag * Math.cos((initialAngle * Math.PI) / 180);
			relativeY = initialMag * Math.sin((initialAngle * Math.PI) / 180);
		} else {
			relativeX = pos.x;
			relativeY = pos.y;
		}

		console.log(
			'%c @stepvista/core · SV-Vector v1.2.3 ',
			'background: #0f172a; color: #10b981; font-weight: bold; padding: 4px 10px; border-radius: 4px;'
		);
	});

	// Recompute physical stats
	$effect(() => {
		pos = { x: relativeX, y: relativeY };
		mag = toRecordFormat(getMagnitude({ x: relativeX, y: relativeY }));
		angle = toRecordFormat(getAngle({ x: relativeX, y: relativeY }));
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
		e.stopPropagation();
		dragType = type;
	}

	function handleMove(event: MouseEvent | TouchEvent) {
		if (!dragType) return;

		const coords = translateCoords(event);
		if (!coords) return;

		if (dragType === 'tip') {
			relativeX = snap(coords.x - originX, step);
			relativeY = snap(coords.y - originY, step);
		} else if (dragType === 'origin') {
			originX = snap(coords.x, step);
			originY = snap(coords.y, step);
		}
	}

	function handleEnd() {
		dragType = null;
	}

	function handleKeyDown(type: 'tip' | 'origin', e: KeyboardEvent) {
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
		stroke-width="3"
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

	<!-- Tooltip (Vanilla CSS for Robust Visibility) -->
	{#if showTooltip}
		<foreignObject 
			x={originX + relativeX + 15} 
			y={originY + relativeY - 50} 
			width="130" height="90" 
			style="pointer-events: none;"
		>
			<div class="sv-tooltip">
				<span class="sv-header">{label}</span>
				<div class="sv-data">
					<span class="sv-label">Magnitude</span>
					<span class="sv-val mag">{mag}</span>
				</div>
				<div class="sv-data">
					<span class="sv-label">Angle</span>
					<span class="sv-val angle">{angle}°</span>
				</div>
			</div>
		</foreignObject>
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

	.sv-tooltip {
		display: flex;
		flex-direction: column;
		background: #0f172a; /* Explicit dark slate background for white text */
		background: rgba(15, 23, 42, 0.95);
		backdrop-filter: blur(4px);
		border: 1px solid rgba(51, 65, 85, 0.5);
		padding: 8px 10px;
		border-radius: 6px;
		color: #f8fafc; /* Safe white text color */
		font-family: 'Inter', sans-serif;
		box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
	}

	.sv-header {
		font-weight: 700;
		color: #94a3b8;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		font-size: 8px;
		margin-bottom: 6px;
		border-bottom: 1px solid rgba(51, 65, 85, 0.5);
		padding-bottom: 4px;
	}

	.sv-data {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 8px;
		margin-bottom: 2px;
	}

	.sv-label {
		color: #64748b;
		font-weight: 500;
		font-size: 9px;
	}

	.sv-val {
		font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
		font-weight: 700;
		font-size: 10px;
	}

	.sv-val.mag {
		color: #38bdf8;
	}

	.sv-val.angle {
		color: #10b981;
	}
</style>
