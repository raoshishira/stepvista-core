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
 * Returns the angle of the vector in degrees (0 to 360)
 */
export function getAngle(v: Vector): number {
    const radians = Math.atan2(v.y, v.x);
    let degrees = radians * (180 / Math.PI);
    return degrees < 0 ? degrees + 360 : degrees;
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
