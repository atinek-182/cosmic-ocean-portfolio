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
    private activeTriggers: Map<string, InteractionEventData> = new Map();
    private triggers: Array<{
        id: string;
        type: string;
        x: number;
        z: number;
        radius: number;
    }> = [];
    public nearestTriggerData: { id: string, distance: number } | null = null;

    public getActiveTriggers(): InteractionEventData[] {
        return Array.from(this.activeTriggers.values());
    }

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
        let minDistance = Infinity;
        let nearestId: string | null = null;

        // Process all triggers independently
        for (const trigger of this.triggers) {
            const dx = boatPosition.x - trigger.x;
            const dz = boatPosition.z - trigger.z;
            const distance = Math.hypot(dx, dz);
            
            // Track nearest for global nearestTriggerData (preserves backwards compat)
            if (distance < minDistance) {
                minDistance = distance;
                nearestId = trigger.id;
            }

            const isCurrentlyActive = this.activeTriggers.has(trigger.id);
            const hysteresisBuffer = 0.5;

            if (!isCurrentlyActive && distance <= trigger.radius) {
                // State Transition: Outside -> Inside
                const data: InteractionEventData = { id: trigger.id, type: trigger.type };
                this.activeTriggers.set(trigger.id, data);
                this.emit('triggerEnter', data);
            } else if (isCurrentlyActive && distance > (trigger.radius + hysteresisBuffer)) {
                // State Transition: Inside -> Outside
                const data = this.activeTriggers.get(trigger.id)!;
                this.activeTriggers.delete(trigger.id);
                this.emit('triggerExit', data);
            }
            // State Inside->Inside and Outside->Outside do nothing.
        }

        if (nearestId !== null) {
            this.nearestTriggerData = { id: nearestId, distance: minDistance };
        } else {
            this.nearestTriggerData = null;
        }
    }
}
