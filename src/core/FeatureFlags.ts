import type { PortfolioData } from '../data/schemas';

export default class FeatureFlags {
    public enableWhale: boolean;
    public enableAudio: boolean;
    public enableAnalytics: boolean;
    public enableObservatory: boolean;
    public enablePostProcessing: boolean;

    constructor(data?: PortfolioData['featureFlags']) {
        this.enableWhale = data?.enableWhale ?? true;
        this.enableAudio = data?.enableAudio ?? true;
        this.enableAnalytics = data?.enableAnalytics ?? true;
        this.enableObservatory = data?.enableObservatory ?? true;
        this.enablePostProcessing = data?.enablePostProcessing ?? true;
    }
}
