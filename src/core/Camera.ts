import * as THREE from 'three';
import App from './App';
import { damp } from '../utils/mathUtils';
import { DEBUG_WORLD, DEBUG_CAMERA_DISTANCE } from './Constants';

export default class Camera {
    public app: App;
    public instance: THREE.OrthographicCamera;
    public targetPosition: THREE.Vector3;
    private offset: THREE.Vector3;
    private followDamping: number = 5.0;

    constructor(app: App) {
        this.app = app;
        
        const aspect = this.app.sizes.width / this.app.sizes.height;
        let frustumSize = 20;
        if (DEBUG_WORLD) frustumSize *= DEBUG_CAMERA_DISTANCE;
        
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
        this.offset = new THREE.Vector3(20, 20, 20); // Maintain isometric offset
        
        if (DEBUG_WORLD) {
            this.offset.multiplyScalar(DEBUG_CAMERA_DISTANCE);
        }

        this.instance.position.copy(this.targetPosition).add(this.offset);
        this.instance.lookAt(this.targetPosition);
        
        this.app.scene.add(this.instance);

        this.app.sizes.on('resize', () => {
            this.resize();
        });
    }

    public resize(): void {
        // Camera only acts as a framing tool, derived from world scale
        // TODO: (Milestone 8) Evaluate mobile-specific orthographic frustum size/zoom offset.
        // Mobile screens currently appear slightly too close to the boat compared to desktop.
        let frustumSize = 20;
        if (DEBUG_WORLD) frustumSize *= DEBUG_CAMERA_DISTANCE;

        const aspect = this.app.sizes.width / this.app.sizes.height;
        this.instance.left = (frustumSize * aspect) / -2;
        this.instance.right = (frustumSize * aspect) / 2;
        this.instance.top = frustumSize / 2;
        this.instance.bottom = frustumSize / -2;
        
        this.instance.updateProjectionMatrix();
    }

    public updateFollow(target: THREE.Vector3, deltaTime: number): void {
        // Damp the target position towards the actual target (boat)
        this.targetPosition.x = damp(this.targetPosition.x, target.x, this.followDamping, deltaTime);
        this.targetPosition.y = damp(this.targetPosition.y, target.y, this.followDamping, deltaTime);
        this.targetPosition.z = damp(this.targetPosition.z, target.z, this.followDamping, deltaTime);

        // Position is exactly offset from the interpolated target position
        this.instance.position.copy(this.targetPosition).add(this.offset);
        
        // Maintain isometric angle
        this.instance.lookAt(this.targetPosition);
    }

    public update(): void {
        // Fallback for when not following
        this.instance.lookAt(this.targetPosition);
    }
}
