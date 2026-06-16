import EventEmitter from 'eventemitter3';
import * as THREE from 'three';
import App from '../core/App';

export interface InteractionEventData {
    id: string;
    type: string;
}

export default class InteractionManager extends EventEmitter {
    private app: App;
    private activeTriggerId: string | null = null;
    private triggers: Array<{
        id: string;
        type: string;
        x: number;
        z: number;
        radius: number;
    }> = [];

    constructor(app: App) {
        super();
        this.app = app;

        // Parse triggers from validated content.json
        if (this.app.content.data?.worldTriggers) {
            this.triggers = this.app.content.data.worldTriggers.map(trigger => ({
                id: trigger.id,
                type: trigger.type,
                x: trigger.coordinates.x,
                z: trigger.coordinates.z,
                radius: trigger.triggerRadius
            }));
        }
    }

    public update(boatPosition: THREE.Vector3): void {
        let nearestTrigger = null;
        let minDistance = Infinity;

        // Find the nearest trigger
        for (const trigger of this.triggers) {
            const dx = boatPosition.x - trigger.x;
            const dz = boatPosition.z - trigger.z;
            const distance = Math.hypot(dx, dz);

            if (distance <= trigger.radius && distance < minDistance) {
                minDistance = distance;
                nearestTrigger = trigger;
            }
        }

        // State Machine logic to prevent event spam
        if (nearestTrigger) {
            if (this.activeTriggerId !== nearestTrigger.id) {
                // If we were inside another trigger, exit it first
                if (this.activeTriggerId !== null) {
                    this.emit('triggerExit');
                }

                this.activeTriggerId = nearestTrigger.id;
                this.emit('triggerEnter', {
                    id: nearestTrigger.id,
                    type: nearestTrigger.type
                });
            }
        } else {
            // No trigger nearby
            if (this.activeTriggerId !== null) {
                this.activeTriggerId = null;
                this.emit('triggerExit');
            }
        }
    }
}
