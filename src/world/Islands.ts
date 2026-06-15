import * as THREE from 'three';

export default class Islands {
    public container: THREE.Group;

    constructor() {
        this.container = new THREE.Group();

        // Adjusted positions so they are within initial camera frustum range
        const positions = [
            { x: -15, z: -20, color: 0x2e8b57 }, // Visible right away behind boat
            { x: 25, z: -30, color: 0x8b4513 },
            { x: -40, z: 15, color: 0x556b2f },
            { x: 30, z: 40, color: 0x228b22 }
        ];

        const geo = new THREE.CylinderGeometry(4, 6, 8, 8);
        
        positions.forEach(pos => {
            const mat = new THREE.MeshStandardMaterial({ color: pos.color, flatShading: true });
            const mesh = new THREE.Mesh(geo, mat);
            mesh.position.set(pos.x, 5, pos.z);
            this.container.add(mesh);
        });
    }
}
