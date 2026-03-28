<script lang="ts">
	import { onMount } from 'svelte';
	import { getMagnitude, getAngle, toRecordFormat, snap } from '$lib/physics-engine';

	/**
	 * @typedef {Object} Props
	 * @property {number} [originX=0] - Starting X coordinate
	 * @property {number} [originY=0] - Starting Y coordinate
	 * @property {string} [color='#3b82f6'] - Vector color (hex)
	 * @property {string} [label='Vector'] - Display label
	 * @property {number} [step=10] - Snapping increment
	 * @property {number} [initialMag=100] - Starting magnitude
	 * @property {number} [initialAngle=0] - Starting angle in degrees
	 * @property {(data: { x: number, y: number, mag: number, angle: number }) => void} [onUpdate] - Update callback
	 */

	let {
		originX = 0,
		originY = 0,
		color = '#3b82f6',
		label = 'Vector',
		step = 10,
		initialMag = 100,
		initialAngle = 0,
		onUpdate = () => {}
	} = $props();

	// Tip relative position state using Svelte 5 runes
	let relativeX = $state(0);
	let relativeY = $state(0);
	
	// Initialize and react to prop changes for initial position
	$effect(() => {
		relativeX = initialMag * Math.cos((initialAngle * Math.PI) / 180);
		relativeY = initialMag * Math.sin((initialAngle * Math.PI) / 180);
	});
	
	let tipX = $derived(originX + relativeX);
	let tipY = $derived(originY + relativeY);

	let isDragging = $state(false);
	let groupRef: SVGGElement | null = $state(null);

	// Derived physics values
	let mag = $derived(toRecordFormat(getMagnitude({ x: relativeX, y: relativeY })));
	let angle = $derived(toRecordFormat(getAngle({ x: relativeX, y: relativeY })));

	// Effect to notify parent on change (Proprietary Separation)
	$effect(() => {
		onUpdate({ x: tipX, y: tipY, mag, angle });
	});

	onMount(() => {
		// The StepVista "Dye": Signature and Telemetry
		// Consistency with SV-Grid console footprint
		console.log(
			'%c StepVista: SV-Vector | v1.0.0 ',
			'background: #1e293b; color: #38bdf8; font-weight: bold; padding: 4px 8px; border-radius: 4px; border: 1px solid #334155;'
		);

		// Telemetry logic (Mocked for @stepvista/core repository)
		const telemetry = async () => {
			try {
				await fetch('https://telemetry.stepvista.com/log', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						component: 'SV-Vector',
						label,
						timestamp: new Date().toISOString()
					})
				});
			} catch (e) {
				// Silent fail for physics sandbox environments (Offline usage support)
			}
		};
		telemetry();
	});

	function handleMove(e: MouseEvent | TouchEvent) {
		if (!isDragging || !groupRef) return;

		const svg = groupRef.ownerSVGElement;
		if (!svg) return;

		const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
		const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

		// Correcting coordinates to SVG space for precision snapping
		const point = svg.createSVGPoint();
		point.x = clientX;
		point.y = clientY;
		const ctm = svg.getScreenCTM();
		if (!ctm) return;
		
		const { x, y } = point.matrixTransform(ctm.inverse());

		// Update relative position with snap (relative to origin)
		relativeX = snap(x - originX, step);
		relativeY = snap(y - originY, step);
	}

	function stopDragging() {
		isDragging = false;
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			isDragging = !isDragging;
		}
	}
</script>

<svelte:window 
	onmousemove={handleMove} 
	onmouseup={stopDragging} 
	ontouchmove={handleMove} 
	ontouchend={stopDragging} 
/>

<g bind:this={groupRef} class="sv-vector select-none" style="font-family: 'Inter', sans-serif;">
	<!-- Marker Definition for the Arrowhead -->
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

	<!-- Main Vector Line -->
	<line
		x1={originX}
		y1={originY}
		x2={tipX}
		y2={tipY}
		stroke={color}
		stroke-width="3"
		stroke-linecap="round"
		marker-end="url(#arrowhead-{color.replace('#', '')})"
	/>

	<!-- Invisible Hit Area (Large stroke for easier interaction on mobile) -->
	<line
		x1={originX}
		y1={originY}
		x2={tipX}
		y2={tipY}
		stroke="transparent"
		stroke-width="24"
		class="cursor-move pointer-events-auto"
		role="button"
		tabindex="0"
		aria-label="Drag to resize vector"
		onmousedown={() => (isDragging = true)}
		ontouchstart={() => (isDragging = true)}
		onkeydown={handleKeyDown}
	/>

	<!-- Tip Handle (Interactive Point) -->
	<circle
		cx={tipX}
		cy={tipY}
		r="8"
		fill={color}
		fill-opacity="0.3"
		stroke={color}
		stroke-width="2"
		class="cursor-move hover:fill-opacity-60 transition-all duration-200 pointer-events-auto"
		role="button"
		tabindex="0"
		aria-label="Vector Tip Handle"
		onmousedown={() => (isDragging = true)}
		ontouchstart={() => (isDragging = true)}
		onkeydown={handleKeyDown}
	/>

	<!-- Label / Physics Tooltip (Academic Aesthetic) -->
	<foreignObject x={tipX + 15} y={tipY - 50} width="120" height="85" class="pointer-events-none">
		<div class="flex flex-col bg-slate-900/90 backdrop-blur-md border border-slate-700/50 p-2.5 rounded-lg shadow-2xl text-white text-[10px]">
			<span class="font-bold text-slate-400 uppercase tracking-widest text-[8px] mb-1.5 border-b border-slate-700/50 pb-1">{label}</span>
			<div class="flex justify-between items-center gap-2 mb-0.5">
				<span class="text-slate-500 font-medium text-[9px]">Magnitude</span>
				<span class="font-mono text-sky-400 font-bold">{mag}</span>
			</div>
			<div class="flex justify-between items-center gap-2">
				<span class="text-slate-500 font-medium text-[9px]">Angle</span>
				<span class="font-mono text-emerald-400 font-bold">{angle}°</span>
			</div>
		</div>
	</foreignObject>
</g>

<style>
	.sv-vector {
		pointer-events: none;
	}
	.cursor-move {
		cursor: move;
	}
</style>
