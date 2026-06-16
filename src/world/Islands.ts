import * as THREE from 'three';
import App from '../core/App';
import { DEBUG_WORLD } from '../core/Constants';

export default class Islands {
    public mesh: THREE.Group;
    private app: App;

    constructor(app: App) {
        this.app = app;
        this.mesh = new THREE.Group();

        if (this.app.content.data?.worldTriggers) {
            this.app.content.data.worldTriggers.forEach(trigger => {
                let x = trigger.coordinates.x;
                let z = trigger.coordinates.z;

                if (DEBUG_WORLD) {
                    if (trigger.id === 'project-alpha') { x = 20; z = 20; }
                    else if (trigger.id === 'harbor') { x = 40; z = 40; }
                    else if (trigger.id === 'observatory') { x = 60; z = 20; }
                }

                this.createPlaceholder(x, z, trigger.triggerRadius, trigger.type, trigger.id);
            });
        }
    }

    private createPlaceholder(x: number, z: number, radius: number, type: string, id: string): void {
        let color = 0xaaaaaa;
        if (type === 'project') color = 0x44ff44;
        else if (type === 'harbor') color = 0x4444ff;
        else if (type === 'observatory') color = 0xff44ff;

        let geo: THREE.BufferGeometry = new THREE.CylinderGeometry(radius * 0.5, radius * 0.8, 4, 16);
        let mat = new THREE.MeshStandardMaterial({ color });

        if (DEBUG_WORLD) {
            color = 0xffff00; // Bright yellow
            geo = new THREE.CylinderGeometry(4, 4, 8, 16);
            mat = new THREE.MeshStandardMaterial({ color });
        }

        const island = new THREE.Mesh(geo, mat);
        island.position.set(x, DEBUG_WORLD ? 4 : 2, z);

        // Debug visual for the trigger radius
        const radiusGeo = new THREE.RingGeometry(radius - 0.5, radius, 32);
        radiusGeo.rotateX(-Math.PI * 0.5);
        const radiusMat = new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide, transparent: true, opacity: 0.5 });
        const radiusRing = new THREE.Mesh(radiusGeo, radiusMat);
        radiusRing.position.set(x, 0.1, z);

        this.mesh.add(island);
        this.mesh.add(radiusRing);

        if (DEBUG_WORLD) {
            this.createFloatingLabel(x, z, id);
        }
    }

    private createFloatingLabel(x: number, z: number, id: string): void {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.fillStyle = 'white';
            ctx.font = 'bold 48px Arial';
            ctx.textAlign = 'center';
            let label = id;
            if (id === 'project-alpha') label = 'Project Alpha';
            else if (id === 'harbor') label = 'Harbor';
            else if (id === 'observatory') label = 'Observatory';
            ctx.fillText(label, 256, 64);
        }
        
        const texture = new THREE.CanvasTexture(canvas);
        const spriteMat = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(spriteMat);
        sprite.position.set(x, 10, z); // Float above the yellow cylinder
        sprite.scale.set(10, 2.5, 1);
        this.mesh.add(sprite);
    }
}
