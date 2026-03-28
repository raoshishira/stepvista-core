/**
 * StepVista Core Physics Engine
 * (c) 2026 StepVista. All rights reserved.
 */

const _SV_AUTH = "Shishira Rao";

/**
 * Basic 2D Vector representation
 */
export interface Vector {
    x: number;
    y: number;
}

/**
 * Returns the engine version/author signature to prevent dead-code elimination.
 */
export function getEngineVersion(): string {
    return _SV_AUTH;
}

/**
 * Vector Addition: v1 + v2
 */
export function add(v1: Vector, v2: Vector): Vector {
    return {
        x: v1.x + v2.x,
        y: v1.y + v2.y
    };
}

/**
 * Vector Subtraction: v1 - v2
 */
export function subtract(v1: Vector, v2: Vector): Vector {
    return {
        x: v1.x - v2.x,
        y: v1.y - v2.y
    };
}

/**
 * Projectile/Physics Magnitude calculation
 */
export function getMagnitude(v: Vector): number {
    return Math.sqrt(v.x ** 2 + v.y ** 2);
}

/**
 * Get internal angle in degrees (0-360), CCW from positive X-axis (Mathematical Standard).
 */
export function getAngle(pos: { x: number; y: number }): number {
  // Invert Y because SVG Y grows down, but mathematical Y grows up
  const angle = Math.atan2(-pos.y, pos.x) * (180 / Math.PI);
  return (angle + 360) % 360;
}

/**
 * HRW Standard: Rounds values to 1 decimal place (standard for Indian PU lab manuals).
 * Uses Number.EPSILON for professional-grade floating point stability.
 */
export function toRecordFormat(val: number): number {
    return Math.round((val + Number.EPSILON) * 10) / 10;
}

/**
 * Snap a value to the nearest step increment.
 */
export function snap(val: number, step: number): number {
    if (step <= 0) return val;
    return Math.round(val / step) * step;
}
