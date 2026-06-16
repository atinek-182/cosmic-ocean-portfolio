export function lerp(start: number, end: number, t: number): number {
    return start + (end - start) * clamp(t, 0, 1);
}

export function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
}

/**
 * Frame-rate independent damping function.
 * @param current The current value.
 * @param target The target value.
 * @param lambda The smoothing factor (higher = faster, e.g., 5-15).
 * @param dt Delta time in seconds.
 * @returns The smoothed value.
 */
export function damp(current: number, target: number, lambda: number, dt: number): number {
    return lerp(current, target, 1 - Math.exp(-lambda * dt));
}
