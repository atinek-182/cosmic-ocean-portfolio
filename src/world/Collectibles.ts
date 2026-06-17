import * as THREE from 'three';
import App from '../core/App';

export default class Collectibles {
    public mesh: THREE.Group;
    private app: App;
    private collectiblesList: Array<{ mesh: THREE.Object3D, id: string }> = [];

    constructor(app: App) {
        this.app = app;
        this.mesh = new THREE.Group();

        if (this.app.content.data?.worldTriggers) {
            this.app.content.data.worldTriggers.forEach(trigger => {
                if (trigger.type === 'collectible') {
                    // Check ProgressManager BEFORE spawning to prevent flash
                    if (!this.app.progress.hasCollectedItem(trigger.id)) {
                        this.spawnCollectible(trigger.id, trigger.coordinates.x, trigger.coordinates.z);
                    }
                }
            });
        }
        
        // Listen to ProgressManager to hide collected items dynamically
        this.app.progress.on('progressUpdated', () => {
            this.refreshVisibility();
        });
    }

    private spawnCollectible(id: string, x: number, z: number): void {
        const geo = new THREE.OctahedronGeometry(1.5, 0);
        const mat = new THREE.MeshStandardMaterial({ 
            color: 0xffd700, 
            emissive: 0xffaa00,
            emissiveIntensity: 0.5,
            metalness: 0.8,
            roughness: 0.2
        });
        const star = new THREE.Mesh(geo, mat);
        
        star.position.set(x, 2, z); // Float above water
        
        this.mesh.add(star);
        this.collectiblesList.push({ mesh: star, id });
    }

    private refreshVisibility(): void {
        for (const item of this.collectiblesList) {
            if (item.mesh.visible && this.app.progress.hasCollectedItem(item.id)) {
                item.mesh.visible = false;
                // Optional: play sound or particle effect here
            }
        }
    }

    public update(deltaTime: number, elapsedTime: number): void {
        for (const item of this.collectiblesList) {
            if (item.mesh.visible) {
                // Bobbing and spinning effect
                item.mesh.rotation.y += deltaTime;
                item.mesh.position.y = 2 + Math.sin(elapsedTime * 2 + item.mesh.position.x) * 0.5;
            }
        }
    }
}
