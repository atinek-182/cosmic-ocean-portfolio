export default class InputManager {
    public forward: boolean = false;
    public backward: boolean = false;
    public left: boolean = false;
    public right: boolean = false;

    constructor() {
        window.addEventListener('keydown', this.onKeyDown.bind(this));
        window.addEventListener('keyup', this.onKeyUp.bind(this));
    }

    private onKeyDown(event: KeyboardEvent): void {
        switch (event.code) {
            case 'KeyW':
            case 'ArrowUp':
                this.forward = true;
                break;
            case 'KeyS':
            case 'ArrowDown':
                this.backward = true;
                break;
            case 'KeyA':
            case 'ArrowLeft':
                this.left = true;
                break;
            case 'KeyD':
            case 'ArrowRight':
                this.right = true;
                break;
        }
    }

    private onKeyUp(event: KeyboardEvent): void {
        switch (event.code) {
            case 'KeyW':
            case 'ArrowUp':
                this.forward = false;
                break;
            case 'KeyS':
            case 'ArrowDown':
                this.backward = false;
                break;
            case 'KeyA':
            case 'ArrowLeft':
                this.left = false;
                break;
            case 'KeyD':
            case 'ArrowRight':
                this.right = false;
                break;
        }
    }
}
