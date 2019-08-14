// declare THREE as global available
declare global {
  // eslint-disable-next-line @typescript-eslint/interface-name-prefix
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    THREE: any;
  }
}
import * as THREE from 'three';
// make THREE global available, this is needed for the examples from three.js
window.THREE = THREE;

import { BoundingBox } from './boundingBox';
import { CrossHair } from './crossHair';
import { ParticleRenderer } from './particleRenderer';
import { SettingsGui } from './settingsGui';

require('THREE.TrackballControls');

export class ParticleEngine {
  private _canvas: HTMLCanvasElement;
  private _gl: WebGL2ComputeRenderingContext;
  private _settingsGui: SettingsGui;
  private _scene: THREE.Scene;
  private _camera: THREE.PerspectiveCamera;
  private _renderer: THREE.WebGLRenderer;
  //private readonly _boundingBoxDimension = new THREE.Vector3(4.0, 4.0, 4.0);
  private readonly _boundingBoxDimension = new THREE.Vector3(8.0, 5.0, 5.0);
  private _boundingBox: BoundingBox;
  private _crossHair: CrossHair;
  private _controls: THREE.TrackballControls;
  private _elapsed = 0;
  private _particleRender: ParticleRenderer;

  constructor(canvasId: string) {
    this._canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    // const contexName = 'webgl2';
    const contexName = 'webgl2-compute';
    this._gl = this._canvas.getContext(contexName, {
      antialias: true,
    });
  }

  public supportsWebGL2WithCompute(): boolean {
    return this._gl ? true : false;
  }

  public createScene(): boolean {
    this._settingsGui = new SettingsGui();

    const w = this._canvas.clientWidth;
    const h = this._canvas.clientHeight;

    this._scene = new THREE.Scene();
    this._camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
    this._renderer = new THREE.WebGLRenderer({
      canvas: this._canvas,
      context: this._gl,
    });

    this._renderer.setPixelRatio(window.devicePixelRatio);
    this._renderer.setClearColor(0x000000, 0.0);
    this._renderer.setSize(w, h, false);

    // create the bounding box
    this._boundingBox = new BoundingBox(this._boundingBoxDimension, this._scene, w, h);

    // create the cross hair
    this._crossHair = new CrossHair(
      new THREE.Vector3(1.0, 1.0, 1.0),
      this._boundingBoxDimension,
      this._scene,
      this._settingsGui.getSettings(),
      w,
      h
    );

    this._camera.position.z = 10;

    this._controls = new THREE.TrackballControls(this._camera, this._canvas);
    this._controls.rotateSpeed = 2.5;
    this._controls.zoomSpeed = 2.5;
    this._controls.panSpeed = 0.8;
    this._controls.noZoom = false;
    this._controls.noPan = true;
    this._controls.staticMoving = true;
    this._controls.dynamicDampingFactor = 0.3;
    this._controls.keys = [65, 83, 68];
    // this._controls.addEventListener('change', render);

    this._particleRender = new ParticleRenderer(
      this._gl,
      this._camera,
      this._settingsGui.getSettings(),
      this._boundingBoxDimension
    );
    return this._particleRender.init();
  }

  public startRender(): void {
    window.addEventListener('resize', () => {
      const w = this._canvas.clientWidth;
      const h = this._canvas.clientHeight;
      this.resize(w, h);
    });
    this.animate(0);
  }

  private resize(w: number, h: number): void {
    this._camera.aspect = w / h;
    this._camera.updateProjectionMatrix();
    this._renderer.setSize(w, h, false);

    this._boundingBox.resize(w, h);
    this._crossHair.resize(w, h);
  }

  private animate(time: number): void {
    window.requestAnimationFrame((time: number) => {
      this.animate(time);
    });

    const now = window.performance.now();
    const delta = now - this._elapsed;
    this._elapsed = now;

    this._controls.update();
    this._crossHair.update();
    this._settingsGui.updateFrames(delta);

    this._renderer.render(this._scene, this._camera);

    this._particleRender.update(time / 1000);
    this._renderer.state.reset();
  }
}
