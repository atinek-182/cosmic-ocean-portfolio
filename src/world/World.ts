import App from '../core/App';
import Boat from './Boat';
import Ocean from './Ocean';
import Islands from './Islands';
import * as THREE from 'three';

export default class World {
    public app: App;
    public boat: Boat;
    public ocean: Ocean;
    public islands: Islands;

    constructor(app: App) {
        this.app = app;

        // Environmental aesthetics
        this.app.scene.fog = new THREE.FogExp2(0x0A0F1D, 0.015);
        this.app.scene.background = new THREE.Color(0x0A0F1D);
        
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
        this.app.scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffee, 2.5);
        dirLight.position.set(100, 100, 50);
        this.app.scene.add(dirLight);

        // Initialize entities
        this.boat = new Boat();
        this.ocean = new Ocean(this.app.time);
        this.islands = new Islands();

        // Attach to scene
        this.app.scene.add(this.boat.mesh);
        this.app.scene.add(this.ocean.mesh);
        this.app.scene.add(this.islands.container);
    }

    public update() {
        const deltaTimeSeconds = this.app.time.delta * 0.001;

        // Update entities
        this.boat.update(deltaTimeSeconds);
        this.ocean.update();
        
        // Pass boat position to camera for follow logic
        this.app.camera.updateFollow(this.boat.mesh.position, deltaTimeSeconds);
    }
}
