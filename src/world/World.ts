import * as THREE from 'three';
import App from '../core/App';
import BoatController from './BoatController';
import InteractionManager from './InteractionManager';
import Islands from './Islands';
import InputManager from '../core/InputManager';
import { WORLD_RADIUS, DEBUG_WORLD, DEBUG_OCEAN } from '../core/Constants';
import { Assets } from '../core/AssetLoader';
import oceanVertex from '../shaders/ocean/vertex.glsl?raw';
import oceanFragment from '../shaders/ocean/fragment.glsl?raw';

export default class World {
    public app: App;
    public boat: BoatController;
    public interaction: InteractionManager;
    public islands: Islands;
    private ocean: THREE.Mesh;
    private lastLogTime: number = 0;
    
    // Debug logging state
    private lastLoggedX: number = 0;
    private lastLoggedZ: number = 0;
    private lastLoggedVel: number = 0;
    private lastLoggedTrigger: string | null = null;

    constructor(app: App, input: InputManager, assets: Assets) {
        this.app = app;

        // Create massive placeholder ocean plane
        const oceanGeo = new THREE.PlaneGeometry(WORLD_RADIUS * 4, WORLD_RADIUS * 4, 128, 128); // Add subdivisions for waves
        oceanGeo.rotateX(-Math.PI * 0.5);
        
        const oceanMat = new THREE.ShaderMaterial({
            vertexShader: oceanVertex,
            fragmentShader: oceanFragment,
            uniforms: {
                uTime: { value: 0 },
                uWaveHeight: { value: DEBUG_OCEAN ? 0.2 : 0.4 },
                uWaveSpeed: { value: DEBUG_OCEAN ? 0.5 : 1.0 },
                uDepthColor: { value: new THREE.Color(0x1e3f5a) },
                uSurfaceColor: { value: new THREE.Color(0x4b8eb3) },
                uColorOffset: { value: 0.1 },
                uColorMultiplier: { value: 3.0 }
            }
        });
        
        if (DEBUG_OCEAN) {
            console.log(`[Ocean] Shader initialized. Wave height and speed reduced by 50%.`);
        }
        
        this.ocean = new THREE.Mesh(oceanGeo, oceanMat);
        this.app.scene.add(this.ocean);

        // Initialize boat
        this.boat = new BoatController(input, assets.boat);
        this.app.scene.add(this.boat.mesh);

        // Initialize islands
        this.islands = new Islands(app, assets);
        this.app.scene.add(this.islands.mesh);

        // Initialize interaction manager
        this.interaction = new InteractionManager(app);

        // Basic lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
        directionalLight.position.set(100, 100, 50);
        this.app.scene.add(ambientLight, directionalLight);

        if (DEBUG_WORLD) {
            window.addEventListener('keydown', (e) => {
                if (e.key === '1') {
                    this.boat.mesh.position.set(20, this.boat.mesh.position.y, 20);
                } else if (e.key === '2') {
                    this.boat.mesh.position.set(40, this.boat.mesh.position.y, 40);
                } else if (e.key === '3') {
                    this.boat.mesh.position.set(60, this.boat.mesh.position.y, 20);
                }
            });
        }
    }

    public update(deltaTime: number): void {
        this.boat.update(deltaTime);
        this.interaction.update(this.boat.mesh.position);
        
        // Update Ocean Shader Time
        (this.ocean.material as THREE.ShaderMaterial).uniforms.uTime.value = this.app.time.elapsed * 0.001;

        if (DEBUG_WORLD) {
            this.lastLogTime += deltaTime;
            if (this.lastLogTime > 1.0) {
                const currentX = this.boat.mesh.position.x;
                const currentZ = this.boat.mesh.position.z;
                const currentVel = this.boat.getVelocity();
                const currentTrigger = this.interaction.nearestTriggerData?.id || null;

                const posChanged = Math.abs(currentX - this.lastLoggedX) > 0.1 || Math.abs(currentZ - this.lastLoggedZ) > 0.1;
                const velChanged = Math.abs(currentVel - this.lastLoggedVel) > 0.1;
                const triggerChanged = currentTrigger !== this.lastLoggedTrigger;

                if (posChanged || velChanged || triggerChanged) {
                    console.log(`[Boat]\nPosition: ${currentX.toFixed(1)}, ${currentZ.toFixed(1)}`);
                    if (this.interaction.nearestTriggerData) {
                        console.log(`[Interaction]\nNearest Trigger: ${this.interaction.nearestTriggerData.id}\nDistance: ${this.interaction.nearestTriggerData.distance.toFixed(1)}`);
                    }
                    
                    this.lastLoggedX = currentX;
                    this.lastLoggedZ = currentZ;
                    this.lastLoggedVel = currentVel;
                    this.lastLoggedTrigger = currentTrigger;
                }
                
                this.lastLogTime = 0;
            }
        }
    }
}
