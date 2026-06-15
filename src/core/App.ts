import * as THREE from 'three';
import Sizes from './Sizes';
import Time from './Time';
import Camera from './Camera';
import Renderer from './Renderer';

export default class App {
    public canvas: HTMLCanvasElement;
    public scene: THREE.Scene;
    public sizes: Sizes;
    public time: Time;
    public camera: Camera;
    public renderer: Renderer;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        
        // Initialize core engine singletons
        this.sizes = new Sizes();
        this.time = new Time();
        this.scene = new THREE.Scene();
        
        // Explicit dependency injection
        this.camera = new Camera(this);
        this.renderer = new Renderer(this);

        // Bind requestAnimationFrame loop to update method
        this.time.on('tick', () => {
            this.update();
        });
    }

    public update(): void {
        this.camera.update();
        this.renderer.update();
    }
}
