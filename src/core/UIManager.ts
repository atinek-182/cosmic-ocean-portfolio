import App from './App';
import { AppState } from './AppState';

export default class UIManager {
    public app: App;
    private container: HTMLElement;
    public currentState: AppState = AppState.LOADING;
    private interactionElement: HTMLElement | null = null;
    private activePrompts: Array<{ id: string, type: string }> = [];

    constructor(app: App) {
        this.app = app;
        
        let container = document.getElementById('ui-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'ui-container';
            document.body.appendChild(container);
        }
        this.container = container;
    }

    public showLoadingScreen(): void {
        this.setState(AppState.LOADING);
        this.container.innerHTML = `
            <div class="loading-screen" style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; background-color: #0a0a2a; color: white;">
                <h1>Loading Universe...</h1>
                <p id="loading-progress">0%</p>
            </div>
        `;
    }

    public updateProgress(progress: number): void {
        const progressEl = document.getElementById('loading-progress');
        if (progressEl) {
            progressEl.innerText = `${Math.round(progress)}%`;
        }
    }

    public showLandingScreen(): void {
        this.setState(AppState.LANDING);
        
        this.container.innerHTML = `
            <div class="landing-screen">
                <h1 class="landing-title">Cosmic Ocean</h1>
                <div class="landing-buttons">
                    <button id="btn-explore" class="btn btn-primary" tabindex="0">Explore 3D Experience</button>
                    <button id="btn-resume" class="btn btn-secondary" tabindex="0">View Standard Resume</button>
                </div>
            </div>
        `;

        document.getElementById('btn-explore')?.addEventListener('click', () => {
            this.startExploring();
        });

        document.getElementById('btn-resume')?.addEventListener('click', () => {
            this.openResumeMode();
        });
    }

    public startExploring(): void {
        this.setState(AppState.EXPLORING);
        this.container.innerHTML = `
            <div class="overlay-nav">
                <button id="btn-view-resume" class="btn btn-outline" tabindex="0">View Resume</button>
            </div>
            <div id="hud-container" style="position: absolute; top: 60px; right: 20px; text-align: right; color: white; background: rgba(0,0,0,0.5); padding: 10px; border-radius: 8px; font-family: monospace;">
                <div>Islands: <span id="hud-islands">0/0</span></div>
                <div>Stars: <span id="hud-stars">0/0</span></div>
                <div>Completion: <span id="hud-percent">0</span>%</div>
            </div>
        `;
        document.getElementById('btn-view-resume')?.addEventListener('click', () => {
            this.openResumeMode();
        });

        // Force a HUD refresh immediately after creating the DOM elements
        this.app.progress.refreshState();
    }

    public openResumeMode(): void {
        this.setState(AppState.RESUME);
        
        const data = this.app.content.data;
        if (!data) return;

        this.container.innerHTML = `
            <div class="resume-mode">
                <nav class="resume-nav">
                    <ul>
                        <li><a href="#summary" tabindex="0">Summary</a></li>
                        <li><a href="#skills" tabindex="0">Skills</a></li>
                        <li><a href="#experience" tabindex="0">Experience</a></li>
                        <li><a href="#projects" tabindex="0">Projects</a></li>
                        <li><a href="#contact" tabindex="0">Contact</a></li>
                    </ul>
                    <button id="btn-close-resume" class="btn btn-outline" aria-label="Close Resume" tabindex="0">Close (Esc)</button>
                </nav>
                <main class="resume-content">
                    <section id="summary" tabindex="0">
                        <h2>Summary</h2>
                        ${data.resume.summary.map(p => `<p>${p}</p>`).join('')}
                    </section>
                    
                    <section id="skills" tabindex="0">
                        <h2>Skills</h2>
                        ${data.skills.map(cat => `
                            <h3>${cat.categoryName}</h3>
                            <ul class="skills-list">
                                ${cat.skills.map(s => `<li>${s.name} - ${s.level || ''}</li>`).join('')}
                            </ul>
                        `).join('')}
                    </section>

                    <section id="experience" tabindex="0">
                        <h2>Experience</h2>
                        ${data.resume.experience.map(exp => `
                            <div class="job">
                                <h3>${exp.role} at ${exp.company}</h3>
                                <span class="dates">${exp.startDate} - ${exp.endDate}</span>
                                <ul>
                                    ${exp.bullets.map(b => `<li>${b}</li>`).join('')}
                                </ul>
                            </div>
                        `).join('')}
                    </section>

                    <section id="projects" tabindex="0">
                        <h2>Projects</h2>
                        ${data.projects.map(proj => `
                            <div class="project-card">
                                <h3>${proj.title} (${proj.year})</h3>
                                <p><strong>Problem:</strong> ${proj.description.problem}</p>
                                <p><strong>Solution:</strong> ${proj.description.solution}</p>
                            </div>
                        `).join('')}
                    </section>

                    <section id="contact" tabindex="0">
                        <h2>Contact</h2>
                        <p>${data.developer.name}</p>
                        <p><a href="mailto:${data.developer.email}" tabindex="0">${data.developer.email}</a></p>
                        <p><a href="${data.developer.github}" target="_blank" tabindex="0">GitHub</a></p>
                    </section>
                </main>
            </div>
        `;

        document.getElementById('btn-close-resume')?.addEventListener('click', () => {
            this.startExploring();
        });

        // Add Escape key listener
        const escListener = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && this.currentState === AppState.RESUME) {
                this.startExploring();
                window.removeEventListener('keydown', escListener);
            }
        };
        window.addEventListener('keydown', escListener);
    }

    public showErrorScreen(errors: string[]): void {
        this.container.innerHTML = `
            <div class="error-screen">
                <h1>Fatal Content Error</h1>
                <p>Failed to validate content.json against schema.</p>
                <ul class="error-list">
                    ${errors.map(err => `<li>${err}</li>`).join('')}
                </ul>
            </div>
        `;
    }

    public updateHUD(data: { islands: number, totalIslands: number, collectibles: number, totalCollectibles: number, percentage: number }): void {
        const islandsEl = document.getElementById('hud-islands');
        const starsEl = document.getElementById('hud-stars');
        const percentEl = document.getElementById('hud-percent');

        if (islandsEl) islandsEl.innerText = `${data.islands}/${data.totalIslands}`;
        if (starsEl) starsEl.innerText = `${data.collectibles}/${data.totalCollectibles}`;
        if (percentEl) percentEl.innerText = `${Math.round(data.percentage)}`;
    }

    public showInteractionPrompt(data: { id: string, type: string }): void {
        // Add to stack if not present
        if (!this.activePrompts.find(p => p.id === data.id)) {
            this.activePrompts.push(data);
        }
        this.renderTopPrompt();
    }

    public hideInteractionPrompt(id: string): void {
        this.activePrompts = this.activePrompts.filter(p => p.id !== id);
        this.renderTopPrompt();
    }

    private renderTopPrompt(): void {
        // Filter out items that are already collected so their prompts disappear permanently
        const validPrompts = this.activePrompts.filter(p => {
            if (p.type === 'collectible' && this.app.progress.hasCollectedItem(p.id)) return false;
            return true;
        });

        if (validPrompts.length === 0) {
            if (this.interactionElement) this.interactionElement.style.display = 'none';
            return;
        }

        // Priority: Collectibles > Islands (since collectibles are small and temporary)
        validPrompts.sort((a, b) => {
            if (a.type === 'collectible' && b.type !== 'collectible') return -1;
            if (a.type !== 'collectible' && b.type === 'collectible') return 1;
            return 0;
        });

        const topPrompt = validPrompts[0];

        if (!this.interactionElement) {
            this.interactionElement = document.createElement('div');
            this.interactionElement.className = 'interaction-prompt';
            this.interactionElement.style.position = 'absolute';
            this.interactionElement.style.bottom = '20%';
            this.interactionElement.style.left = '50%';
            this.interactionElement.style.transform = 'translateX(-50%)';
            this.interactionElement.style.padding = '10px 20px';
            this.interactionElement.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            this.interactionElement.style.color = 'white';
            this.interactionElement.style.borderRadius = '8px';
            this.interactionElement.style.textAlign = 'center';
            this.container.appendChild(this.interactionElement);
        }
        
        let message = 'Press Enter to Interact';
        if (topPrompt.type === 'collectible') {
            message = 'Press Enter to Collect';
        }

        this.interactionElement.innerHTML = `
            <p style="margin: 0; font-weight: bold;">${message}</p>
            <p style="margin: 5px 0 0 0; font-size: 12px;">Trigger: ${topPrompt.id} (${topPrompt.type})</p>
        `;
        this.interactionElement.style.display = 'block';
    }

    private setState(newState: AppState): void {
        this.currentState = newState;
    }
}
