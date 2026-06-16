import * as THREE from 'three';
import App from '../core/App';
import BoatController from './BoatController';
import InteractionManager from './InteractionManager';
import Islands from './Islands';
import InputManager from '../core/InputManager';
import { WORLD_RADIUS } from '../core/Constants';

export default class World {
    public app: App;
    public boat: BoatController;
    public interaction: InteractionManager;
    public islands: Islands;
    private ocean: THREE.Mesh;

    constructor(app: App, input: InputManager) {
        this.app = app;

        // Create massive placeholder ocean plane
        const oceanGeo = new THREE.PlaneGeometry(WORLD_RADIUS * 4, WORLD_RADIUS * 4);
        oceanGeo.rotateX(-Math.PI * 0.5);
        const oceanMat = new THREE.MeshBasicMaterial({ color: 0x1e3f5a });
        this.ocean = new THREE.Mesh(oceanGeo, oceanMat);
        this.app.scene.add(this.ocean);

        // Initialize boat
        this.boat = new BoatController(input);
        this.app.scene.add(this.boat.mesh);

        // Initialize islands
        this.islands = new Islands(app);
        this.app.scene.add(this.islands.mesh);

        // Initialize interaction manager
        this.interaction = new InteractionManager(app);

        // Basic lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
        directionalLight.position.set(100, 100, 50);
        this.app.scene.add(ambientLight, directionalLight);
    }

    public update(deltaTime: number): void {
        this.boat.update(deltaTime);
        this.interaction.update(this.boat.mesh.position);
    }
}
