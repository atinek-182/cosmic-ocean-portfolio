import * as THREE from 'three';
import App from './App';

export default class Renderer {
    public app: App;
    public instance: THREE.WebGLRenderer;

    constructor(app: App) {
        this.app = app;

        this.instance = new THREE.WebGLRenderer({
            canvas: this.app.canvas,
            antialias: true
        });

        // Use strict color spaces per architecture document
        this.instance.outputColorSpace = THREE.SRGBColorSpace;
        this.instance.toneMapping = THREE.ACESFilmicToneMapping;
        
        this.instance.setSize(this.app.sizes.width, this.app.sizes.height);
        this.instance.setPixelRatio(this.app.sizes.pixelRatio);

        this.app.sizes.on('resize', () => {
            this.resize();
        });
    }

    public resize(): void {
        this.instance.setSize(this.app.sizes.width, this.app.sizes.height);
        this.instance.setPixelRatio(this.app.sizes.pixelRatio);
    }

    public update(): void {
        this.instance.render(this.app.scene, this.app.camera.instance);
    }
}
