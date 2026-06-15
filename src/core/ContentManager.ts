import EventEmitter from 'eventemitter3';
import { PortfolioDataSchema, type PortfolioData } from '../data/schemas';

export default class ContentManager extends EventEmitter {
    public data: PortfolioData | null = null;
    public validationErrors: string[] = [];

    constructor() {
        super();
    }

    public async loadContent(): Promise<void> {
        try {
            // Use BASE_URL for proper resolution in production and add cache-buster
            const baseUrl = import.meta.env.BASE_URL;
            const cacheBuster = Date.now();
            const response = await fetch(`${baseUrl}data/content.json?t=${cacheBuster}`, {
                cache: 'no-cache'
            });
            if (!response.ok) {
                throw new Error(`Failed to load content.json: ${response.status} ${response.statusText}`);
            }

            const rawData = await response.json();
            
            // Validate with Zod
            const parsedData = PortfolioDataSchema.safeParse(rawData);

            if (!parsedData.success) {
                this.validationErrors = parsedData.error.issues.map((err: any) => 
                    `[${err.path.join('.')}] ${err.message}`
                );
                console.error('Content Validation Failed:', this.validationErrors);
                this.emit('contentFailed', this.validationErrors);
                return;
            }

            this.data = parsedData.data;
            this.emit('contentLoaded', this.data);

        } catch (error) {
            const msg = error instanceof Error ? error.message : String(error);
            this.validationErrors = [msg];
            console.error('Content Loading Failed:', msg);
            this.emit('contentFailed', this.validationErrors);
        }
    }
}
