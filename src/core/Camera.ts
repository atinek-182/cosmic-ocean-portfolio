import * as THREE from 'three';
import App from './App';

export default class Camera {
    public app: App;
    public instance: THREE.OrthographicCamera;
    public targetPosition: THREE.Vector3;
    public offset: THREE.Vector3;

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
        this.offset = new THREE.Vector3(20, 20, 20); // Fixed isometric offset

        // Initial isometric offset +20 on X, Y, Z
        this.instance.position.copy(this.targetPosition).add(this.offset);
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

    public updateFollow(target: THREE.Vector3, deltaTime: number): void {
        // Smoothly lerp the target position towards the boat
        this.targetPosition.lerp(target, 5 * deltaTime);
        
        // Calculate desired camera position by adding offset
        const desiredPosition = this.targetPosition.clone().add(this.offset);
        
        // Smoothly lerp camera position
        this.instance.position.lerp(desiredPosition, 5 * deltaTime);
        
        // Keep camera looking at the interpolated target
        this.instance.lookAt(this.targetPosition);
    }

    public update(): void {
        // Keeps the camera looking at target.
        // Future kinematics logic will lerp the targetPosition.
        this.instance.lookAt(this.targetPosition);
    }
}
