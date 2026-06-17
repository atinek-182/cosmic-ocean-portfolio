import EventEmitter from 'eventemitter3';
import { SaveData, SaveDataSchema } from '../data/schemas';

const SAVE_KEY = 'cosmic_ocean_save';
const CURRENT_VERSION = 1;

export default class ProgressManager extends EventEmitter {
    private discoveredIslands: Set<string>;
    private collectedItems: Set<string>;
    private totalIslands: number = 0;
    private totalCollectibles: number = 0;

    constructor() {
        super();
        this.discoveredIslands = new Set();
        this.collectedItems = new Set();
        this.loadProgress();
    }

    public initTotals(triggers: any[]): void {
        this.totalIslands = 0;
        this.totalCollectibles = 0;
        
        for (const trigger of triggers) {
            if (trigger.type === 'collectible') {
                this.totalCollectibles++;
            } else {
                this.totalIslands++;
            }
        }
        this.emitState();
    }

    public refreshState(): void {
        this.emitState();
    }

    public discoverIsland(id: string): void {
        if (!this.discoveredIslands.has(id)) {
            this.discoveredIslands.add(id);
            this.saveProgress();
            this.emitState();
        }
    }

    public collectItem(id: string): void {
        if (!this.collectedItems.has(id)) {
            this.collectedItems.add(id);
            this.saveProgress();
            this.emitState();
        }
    }

    public hasDiscoveredIsland(id: string): boolean {
        return this.discoveredIslands.has(id);
    }

    public hasCollectedItem(id: string): boolean {
        return this.collectedItems.has(id);
    }

    private emitState(): void {
        const total = this.totalIslands + this.totalCollectibles;
        const current = this.discoveredIslands.size + this.collectedItems.size;
        const percentage = total > 0 ? (current / total) * 100 : 0;
        
        this.emit('progressUpdated', {
            islands: this.discoveredIslands.size,
            totalIslands: this.totalIslands,
            collectibles: this.collectedItems.size,
            totalCollectibles: this.totalCollectibles,
            percentage
        });
    }

    private saveProgress(): void {
        const data: SaveData = {
            version: CURRENT_VERSION,
            discoveredIslands: Array.from(this.discoveredIslands),
            collectedItems: Array.from(this.collectedItems)
        };

        try {
            localStorage.setItem(SAVE_KEY, JSON.stringify(data));
        } catch (error) {
            console.warn('[ProgressManager] Failed to save progress to localStorage.', error);
        }
    }

    private loadProgress(): void {
        try {
            const rawData = localStorage.getItem(SAVE_KEY);
            if (!rawData) return; // Clean state
            
            const parsedJson = JSON.parse(rawData);
            const validation = SaveDataSchema.safeParse(parsedJson);
            
            if (validation.success) {
                // Future versions migrations can go here
                if (validation.data.version === CURRENT_VERSION) {
                    this.discoveredIslands = new Set(validation.data.discoveredIslands);
                    this.collectedItems = new Set(validation.data.collectedItems);
                } else {
                    console.warn(`[ProgressManager] Version mismatch. Found ${validation.data.version}, expected ${CURRENT_VERSION}. Wiping save.`);
                    this.wipeSave();
                }
            } else {
                console.warn('[ProgressManager] Invalid save data schema. Wiping save.', validation.error);
                this.wipeSave();
            }
        } catch (error) {
            console.warn('[ProgressManager] Failed to read from localStorage. Wiping save.', error);
            this.wipeSave();
        }
    }

    private wipeSave(): void {
        this.discoveredIslands.clear();
        this.collectedItems.clear();
        try {
            localStorage.removeItem(SAVE_KEY);
        } catch (error) {
            // Ignore
        }
    }
}
