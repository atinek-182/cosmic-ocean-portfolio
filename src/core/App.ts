import * as THREE from 'three';
import Sizes from './Sizes';
import Time from './Time';
import Camera from './Camera';
import Renderer from './Renderer';
import ContentManager from './ContentManager';
import UIManager from './UIManager';
import { AppState } from './AppState';
import FeatureFlags from './FeatureFlags';
import InputManager from './InputManager';
import World from '../world/World';
import AssetLoader, { Assets } from './AssetLoader';

export default class App {
    public canvas: HTMLCanvasElement;
    public scene: THREE.Scene;
    public sizes: Sizes;
    public time: Time;
    public camera: Camera;
    public renderer: Renderer;
    
    public content: ContentManager;
    public ui!: UIManager;
    public flags!: FeatureFlags;
    public input: InputManager;
    public world!: World;
    public assetLoader: AssetLoader;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        
        // 1. Create core systems
        this.sizes = new Sizes();
        this.time = new Time();
        this.scene = new THREE.Scene();
        
        this.camera = new Camera(this);
        this.renderer = new Renderer(this);
        this.content = new ContentManager();
        this.input = new InputManager();
        this.assetLoader = new AssetLoader();

        this.init();
    }

    private async init() {
        // 2. Load content.json
        // 3. Validate content
        this.content.on('contentLoaded', async () => {
            this.flags = new FeatureFlags(this.content.data?.featureFlags);
            
            // 4. Create UIManager
            this.ui = new UIManager(this);
            this.ui.showLoadingScreen();

            // Setup AssetLoader progress
            this.assetLoader.on('assetProgress', (progress: number) => {
                this.ui.updateProgress(progress);
            });

            // 5. Load 3D Assets
            const assets: Assets = await this.assetLoader.loadAll();

            // 6. Initialize World with assets
            this.world = new World(this, this.input, assets);

            // Connect InteractionManager events to UI
            this.world.interaction.on('triggerEnter', (data) => {
                console.log(`[Interaction] Enter Trigger: ${data.id} (${data.type})`);
                if (this.ui) this.ui.showInteractionPrompt(data);
            });

            this.world.interaction.on('triggerExit', (data) => {
                console.log(`[Interaction] Exit Trigger: ${data.id} (${data.type})`);
                if (this.ui) this.ui.hideInteractionPrompt();
            });
            
            // 7. Show Landing Screen
            this.ui.showLandingScreen();

            // Start loop only after UI is ready
            this.time.on('tick', () => {
                this.update();
            });
        });

        this.content.on('contentFailed', (errors: string[]) => {
            // Render full-screen error UI.
            this.ui = new UIManager(this);
            this.ui.showErrorScreen(errors);
        });

        await this.content.loadContent();
    }

    public update(): void {
        // Stop rendering while in RESUME state
        if (this.ui && this.ui.currentState === AppState.RESUME) {
            return;
        }

        const deltaTime = this.time.delta * 0.001; // Convert to seconds

        // Update world physics/logic
        if (this.world) {
            this.world.update(deltaTime);
            this.camera.updateFollow(this.world.boat.mesh.position, deltaTime);
        } else {
            this.camera.update();
        }

        this.renderer.update();
    }
}
