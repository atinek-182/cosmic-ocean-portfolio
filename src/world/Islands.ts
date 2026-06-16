import * as THREE from 'three';
import App from '../core/App';

export default class Islands {
    public mesh: THREE.Group;
    private app: App;

    constructor(app: App) {
        this.app = app;
        this.mesh = new THREE.Group();

        if (this.app.content.data?.worldTriggers) {
            this.app.content.data.worldTriggers.forEach(trigger => {
                this.createPlaceholder(trigger.coordinates.x, trigger.coordinates.z, trigger.triggerRadius, trigger.type);
            });
        }
    }

    private createPlaceholder(x: number, z: number, radius: number, type: string): void {
        let color = 0xaaaaaa;
        if (type === 'project') color = 0x44ff44;
        else if (type === 'harbor') color = 0x4444ff;
        else if (type === 'observatory') color = 0xff44ff;

        // Visual mesh representing the island itself
        const geo = new THREE.CylinderGeometry(radius * 0.5, radius * 0.8, 4, 16);
        const mat = new THREE.MeshStandardMaterial({ color });
        const island = new THREE.Mesh(geo, mat);
        island.position.set(x, 2, z);

        // Debug visual for the trigger radius
        const radiusGeo = new THREE.RingGeometry(radius - 0.5, radius, 32);
        radiusGeo.rotateX(-Math.PI * 0.5);
        const radiusMat = new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide, transparent: true, opacity: 0.5 });
        const radiusRing = new THREE.Mesh(radiusGeo, radiusMat);
        radiusRing.position.set(x, 0.1, z);

        this.mesh.add(island);
        this.mesh.add(radiusRing);
    }
}
