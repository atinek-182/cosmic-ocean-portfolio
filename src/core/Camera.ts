import * as THREE from 'three';
import App from './App';

export default class Camera {
    public app: App;
    public instance: THREE.OrthographicCamera;
    public targetPosition: THREE.Vector3;

    constructor(app: App) {
        this.app = app;
        
        const aspect = this.app.sizes.width / this.app.sizes.height;
        const frustumSize = 20;
        
        // Orthographic Camera locked at isometric angle per TAD
        this.instance = new THREE.OrthographicCamera(
            (frustumSize * aspect) / -2,
            (frustumSize * aspect) / 2,
            frustumSize / 2,
            frustumSize / -2,
            0.1,
            100
        );

        this.targetPosition = new THREE.Vector3(0, 0, 0);

        // Initial isometric offset +10 on X, Y, Z
        this.instance.position.set(10, 10, 10);
        this.instance.lookAt(this.targetPosition);
        
        this.app.scene.add(this.instance);

        this.app.sizes.on('resize', () => {
            this.resize();
        });
    }

    public resize(): void {
        const aspect = this.app.sizes.width / this.app.sizes.height;
        const frustumSize = 20;

        this.instance.left = (frustumSize * aspect) / -2;
        this.instance.right = (frustumSize * aspect) / 2;
        this.instance.top = frustumSize / 2;
        this.instance.bottom = frustumSize / -2;
        
        this.instance.updateProjectionMatrix();
    }

    public update(): void {
        // Keeps the camera looking at target.
        // Future kinematics logic will lerp the targetPosition.
        this.instance.lookAt(this.targetPosition);
    }
}
