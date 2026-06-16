import * as THREE from 'three';
import InputManager from '../core/InputManager';
import { damp, clamp } from '../utils/mathUtils';

export default class BoatController {
    public mesh: THREE.Group;
    private input: InputManager;

    // Kinematic Movement state
    private velocity: number = 0;
    private acceleration: number = 40;
    private drag: number = 2.0; // Friction coefficient
    private maxSpeed: number = 25;

    // Rotation state
    private targetRotationY: number = 0;
    private rotationSpeed: number = 2.0;
    private rotationDampFactor: number = 10.0;

    constructor(input: InputManager) {
        this.input = input;
        
        // Use a Group to easily replace with a GLB model later
        this.mesh = new THREE.Group();

        // Simple placeholder box for the boat
        const geo = new THREE.BoxGeometry(2, 1, 4);
        const mat = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const box = new THREE.Mesh(geo, mat);
        box.position.y = 0.5; // Elevate so it sits on top of the ocean plane
        this.mesh.add(box);
    }

    public update(deltaTime: number): void {
        this.updateRotation(deltaTime);
        this.updateMovement(deltaTime);
    }

    private updateRotation(deltaTime: number): void {
        // Adjust target rotation based on input
        if (this.input.left) {
            this.targetRotationY += this.rotationSpeed * deltaTime;
        }
        if (this.input.right) {
            this.targetRotationY -= this.rotationSpeed * deltaTime;
        }

        // Smoothly rotate current mesh rotation towards the target
        this.mesh.rotation.y = damp(this.mesh.rotation.y, this.targetRotationY, this.rotationDampFactor, deltaTime);
    }

    private updateMovement(deltaTime: number): void {
        // Apply acceleration based on input
        if (this.input.forward) {
            this.velocity += this.acceleration * deltaTime;
        } else if (this.input.backward) {
            this.velocity -= this.acceleration * deltaTime;
        }

        // Apply drag (water resistance)
        // Frame-rate independent exponential decay
        this.velocity *= Math.exp(-this.drag * deltaTime);

        // Enforce speed limits
        this.velocity = clamp(this.velocity, -this.maxSpeed * 0.5, this.maxSpeed);

        // Move boat along its local forward vector (-Z axis by default in Three.js)
        const direction = new THREE.Vector3(0, 0, 1).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.mesh.rotation.y);
        
        this.mesh.position.x += direction.x * this.velocity * deltaTime;
        this.mesh.position.z += direction.z * this.velocity * deltaTime;
    }

    public getVelocity(): number {
        return this.velocity;
    }
}
