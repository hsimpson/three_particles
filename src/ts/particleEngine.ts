// declare THREE as global available
declare global {
  // tslint:disable-next-line: interface-name
  interface Window {
    THREE: any;
  }
}
import * as THREE from 'three';
// make THREE global available, this is needed for the examples from three.js
window.THREE = THREE;

import { BoundingBox } from './boundingBox';
import { CrossHair } from './crossHair';
import { SettingsGui } from './settingsGui';

require('THREE.TrackballControls'); // tslint:disable-line:no-var-requires

export class ParticleEngine {
  private _canvas: HTMLCanvasElement;
  private _gl: WebGL2RenderingContext;
  private _settingsGui: SettingsGui;
  private _scene: THREE.Scene;
  private _camera: THREE.PerspectiveCamera;
  private _renderer: THREE.WebGLRenderer;
  private readonly _boundingBoxDimension = new THREE.Vector3(8.0, 5.0, 5.0);
  private _boundingBox: BoundingBox;
  private _crossHair: CrossHair;
  private _controls: THREE.TrackballControls;
  private _clock: THREE.Clock;

  constructor(canvasId: string) {
    this._canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    this._gl = this._canvas.getContext('webgl2', {
      antialias: true
    });
  }

  public supportsWebGL2(): boolean {
    return this._gl ? true : false;
  }

  public createScene(): void {
    this._settingsGui = new SettingsGui();

    const w = this._canvas.clientWidth;
    const h = this._canvas.clientHeight;

    this._scene = new THREE.Scene();
    this._camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
    this._renderer = new THREE.WebGLRenderer({
      canvas: this._canvas,
      context: this._gl
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

    this._controls = new THREE.TrackballControls(this._camera);
    this._controls.rotateSpeed = 2.5;
    this._controls.zoomSpeed = 2.5;
    this._controls.panSpeed = 0.8;
    this._controls.noZoom = false;
    this._controls.noPan = true;
    this._controls.staticMoving = true;
    this._controls.dynamicDampingFactor = 0.3;
    this._controls.keys = [65, 83, 68];
    // this._controls.addEventListener('change', render);

    this._clock = new THREE.Clock();
  }

  public startRender(): void {
    window.addEventListener('resize', () => {
      const w = this._canvas.clientWidth;
      const h = this._canvas.clientHeight;
      this.resize(w, h);
    });
    this.animate();
  }

  private resize(w: number, h: number): void {
    this._camera.aspect = w / h;
    this._camera.updateProjectionMatrix();
    this._renderer.setSize(w, h, false);

    this._boundingBox.resize(w, h);
    this._crossHair.resize(w, h);
  }

  private animate(): void {
    window.requestAnimationFrame(() => {
      this.animate();
    });
    this._controls.update();
    this._crossHair.update();
    this._settingsGui.updateFrames(this._clock.getDelta());
    this._renderer.render(this._scene, this._camera);
  }
}
