import * as THREE from 'three';

export default class Boat {
    public mesh: THREE.Group;
    public velocity: number = 0;
    public maxSpeed: number = 15;
    public acceleration: number = 20;
    public damping: number = 0.96; // Simulate water resistance
    public rotationSpeed: number = 2.0;

    private keys = {
        forward: false,
        backward: false,
        left: false,
        right: false
    };

    constructor() {
        this.mesh = new THREE.Group();

        // Hull placeholder
        const hullGeo = new THREE.BoxGeometry(2, 1, 4);
        const hullMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const hull = new THREE.Mesh(hullGeo, hullMat);
        hull.position.y = 0.5;

        // Cabin placeholder (to indicate direction)
        const cabinGeo = new THREE.BoxGeometry(1.5, 1, 1.5);
        const cabinMat = new THREE.MeshStandardMaterial({ color: 0x00f0ff });
        const cabin = new THREE.Mesh(cabinGeo, cabinMat);
        cabin.position.set(0, 1.5, -0.5);

        this.mesh.add(hull, cabin);

        this.setupInput();
    }

    private setupInput() {
        window.addEventListener('keydown', (e) => {
            if (e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp') this.keys.forward = true;
            if (e.key === 's' || e.key === 'S' || e.key === 'ArrowDown') this.keys.backward = true;
            if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') this.keys.left = true;
            if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') this.keys.right = true;
        });

        window.addEventListener('keyup', (e) => {
            if (e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp') this.keys.forward = false;
            if (e.key === 's' || e.key === 'S' || e.key === 'ArrowDown') this.keys.backward = false;
            if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') this.keys.left = false;
            if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') this.keys.right = false;
        });
    }

    public update(deltaTime: number) {
        // Rotation (Yaw)
        if (this.keys.left) {
            this.mesh.rotation.y += this.rotationSpeed * deltaTime;
        }
        if (this.keys.right) {
            this.mesh.rotation.y -= this.rotationSpeed * deltaTime;
        }

        // Acceleration
        if (this.keys.forward) {
            this.velocity += this.acceleration * deltaTime;
        }
        if (this.keys.backward) {
            this.velocity -= this.acceleration * deltaTime;
        }

        // Apply constant water damping (friction)
        this.velocity *= this.damping;

        // Strict clamp
        this.velocity = THREE.MathUtils.clamp(this.velocity, -this.maxSpeed * 0.5, this.maxSpeed);

        // Move along the local Z axis
        // Three.js negative Z is forward, so we map rotation via Math.sin/cos
        const dirX = Math.sin(this.mesh.rotation.y);
        const dirZ = Math.cos(this.mesh.rotation.y);

        this.mesh.position.x += dirX * this.velocity * deltaTime;
        this.mesh.position.z += dirZ * this.velocity * deltaTime;
    }
}
