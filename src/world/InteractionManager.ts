import EventEmitter from 'eventemitter3';
import * as THREE from 'three';
import App from '../core/App';
import { DEBUG_WORLD } from '../core/Constants';

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
    public nearestTriggerData: { id: string, distance: number } | null = null;

    constructor(app: App) {
        super();
        this.app = app;

        // Parse triggers from validated content.json
        if (this.app.content.data?.worldTriggers) {
            this.triggers = this.app.content.data.worldTriggers.map(trigger => {
                let x = trigger.coordinates.x;
                let z = trigger.coordinates.z;

                if (DEBUG_WORLD) {
                    if (trigger.id === 'project-alpha') { x = 20; z = 20; }
                    else if (trigger.id === 'harbor') { x = 40; z = 40; }
                    else if (trigger.id === 'observatory') { x = 60; z = 20; }
                }

                return {
                    id: trigger.id,
                    type: trigger.type,
                    x,
                    z,
                    radius: trigger.triggerRadius
                };
            });
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

        if (nearestTrigger) {
            this.nearestTriggerData = { id: nearestTrigger.id, distance: minDistance };
        } else {
            this.nearestTriggerData = null;
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
