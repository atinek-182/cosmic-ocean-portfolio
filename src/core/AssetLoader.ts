import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import EventEmitter from 'eventemitter3';

export interface Assets {
    boat: THREE.Group;
    island: THREE.Group;
}

export default class AssetLoader extends EventEmitter {
    private loadingManager: THREE.LoadingManager;
    private gltfLoader: GLTFLoader;
    private dracoLoader: DRACOLoader;
    public assets: Assets;

    constructor() {
        super();
        this.loadingManager = new THREE.LoadingManager(
            () => {
                // All assets loaded (handled globally by promises anyway)
            },
            (_itemUrl, itemsLoaded, itemsTotal) => {
                const progress = (itemsLoaded / itemsTotal) * 100;
                this.emit('assetProgress', progress);
            },
            (_url) => {
                // Silenced to prevent duplicate warnings; we handle this in the catch block.
            }
        );

        this.gltfLoader = new GLTFLoader(this.loadingManager);
        
        this.dracoLoader = new DRACOLoader(this.loadingManager);
        this.dracoLoader.setDecoderPath('/draco/');
        this.gltfLoader.setDRACOLoader(this.dracoLoader);
        
        // Initialize with null, will be populated
        this.assets = {
            boat: new THREE.Group(),
            island: new THREE.Group()
        };
    }

    public async loadAll(): Promise<Assets> {
        try {
            const boatGltf = await this.gltfLoader.loadAsync('/models/boat.glb');
            this.assets.boat = boatGltf.scene;
        } catch (error) {
            console.warn("[AssetLoader] boat.glb missing. Using fallback.");
            const group = new THREE.Group();
            const geo = new THREE.BoxGeometry(2, 1, 4);
            const mat = new THREE.MeshStandardMaterial({ color: 0xffffff });
            const mesh = new THREE.Mesh(geo, mat);
            mesh.position.y = 0.5;
            group.add(mesh);
            this.assets.boat = group;
        }

        try {
            const islandGltf = await this.gltfLoader.loadAsync('/models/island.glb');
            this.assets.island = islandGltf.scene;
        } catch (error) {
            console.warn("[AssetLoader] island.glb missing. Using fallback.");
            const group = new THREE.Group();
            const geo = new THREE.CylinderGeometry(15, 15, 2, 32);
            const mat = new THREE.MeshStandardMaterial({ color: 0x44aa44 });
            const mesh = new THREE.Mesh(geo, mat);
            mesh.position.y = 1;
            group.add(mesh);
            this.assets.island = group;
        }

        return this.assets;
    }
}
