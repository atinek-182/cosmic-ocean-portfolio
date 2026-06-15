import App from './core/App';

const canvas = document.querySelector('canvas.webgl') as HTMLCanvasElement;

if (canvas) {
    new App(canvas);
} else {
    console.warn('Canvas element not found. Waiting for DOM attachment.');
}
