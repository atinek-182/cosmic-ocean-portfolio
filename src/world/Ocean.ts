import * as THREE from 'three';
import Time from '../core/Time';

export default class Ocean {
    public mesh: THREE.Mesh;
    private time: Time;
    private geometry: THREE.PlaneGeometry;

    constructor(time: Time) {
        this.time = time;
        
        // Large plane segmented for CPU vertex displacement
        this.geometry = new THREE.PlaneGeometry(1000, 1000, 64, 64);
        this.geometry.rotateX(-Math.PI * 0.5); // lay flat

        const material = new THREE.MeshStandardMaterial({
            color: 0x005577, // Deeper, more saturated water color
            roughness: 0.15,
            metalness: 0.85, // More reflective for specular highlights
            flatShading: true // Low-poly stylistic look
        });

        this.mesh = new THREE.Mesh(this.geometry, material);
        this.mesh.position.y = -0.5; // Sit slightly below the boat
    }

    public update() {
        const elapsedTime = this.time.elapsed * 0.001; // ms to seconds
        const positionAttribute = this.geometry.attributes.position;
        
        // Simple CPU sine wave vertex displacement
        for (let i = 0; i < positionAttribute.count; i++) {
            const x = positionAttribute.getX(i);
            const z = positionAttribute.getZ(i);
            
            // Combined sine waves create a rolling water effect
            const y = Math.sin(x * 0.2 + elapsedTime) * 0.6 
                    + Math.cos(z * 0.15 + elapsedTime * 0.8) * 0.4;
            
            positionAttribute.setY(i, y);
        }
        
        // Tell Three.js the vertices changed
        positionAttribute.needsUpdate = true;
        // Recompute normals so the light reflects correctly off the new waves
        this.geometry.computeVertexNormals();
    }
}
