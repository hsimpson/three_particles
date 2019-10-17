import * as THREE from 'three';
import { ISettings } from './settingsGui';
import { Line2 } from 'three/examples/jsm/lines/Line2';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial';

export class CrossHair {
  private _crossHair: THREE.Object3D;
  private _halfBounding: THREE.Vector3;
  private _negativeHalfBounding: THREE.Vector3;

  private _leftPressed = false;
  private _rightPressed = false;
  private _forwardPressed = false;
  private _backPressed = false;
  private _upPressed = false;
  private _downPressed = false;
  private _movementSpeed = 0.1;
  private _settingsObject: ISettings;

  private _xAxisMat: LineMaterial;
  private _yAxisMat: LineMaterial;
  private _zAxisMat: LineMaterial;

  constructor(
    dimensions: THREE.Vector3,
    bounding: THREE.Vector3,
    scene: THREE.Scene,
    settingsObject: ISettings,
    w: number,
    h: number
  ) {
    this._settingsObject = settingsObject;
    this._halfBounding = bounding.clone().multiplyScalar(0.5);
    this._negativeHalfBounding = this._halfBounding.clone().multiplyScalar(-1.0);

    this._crossHair = new THREE.Object3D();
    scene.add(this._crossHair);

    this._xAxisMat = new LineMaterial({
      color: 0xff0000,
      linewidth: 2.0,
    });
    this._yAxisMat = new LineMaterial({
      color: 0x00ff00,
      linewidth: 2.0,
    });
    this._zAxisMat = new LineMaterial({
      color: 0x0000ff,
      linewidth: 2.0,
    });

    this.resize(w, h);

    const xAxisGeometry = new LineGeometry();
    xAxisGeometry.setPositions([-dimensions.x / 2, 0.0, 0.0, dimensions.x / 2, 0.0, 0.0]);

    const yAxisGeometry = new LineGeometry();
    yAxisGeometry.setPositions([0.0, -dimensions.y / 2, 0.0, 0.0, dimensions.y / 2, 0.0]);

    const zAxisGeometry = new LineGeometry();
    zAxisGeometry.setPositions([0.0, 0.0, -dimensions.z / 2, 0.0, 0.0, dimensions.z / 2]);

    /*
    const xAxis = new THREE.Line2(xAxisGeometry, xAxisMat);
    xAxis.computeLineDistances();
    xAxis.scale.set(1, 1, 1);
    */

    this._crossHair.add(new Line2(xAxisGeometry, this._xAxisMat));
    this._crossHair.add(new Line2(yAxisGeometry, this._yAxisMat));
    this._crossHair.add(new Line2(zAxisGeometry, this._zAxisMat));

    document.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.key === ' ') {
        this._settingsObject.forceActive = true;
        this._xAxisMat.linewidth = this._yAxisMat.linewidth = this._zAxisMat.linewidth = 5.0;
      }
      if (event.key === 'a') {
        this._leftPressed = true;
      }
      if (event.key === 's') {
        this._backPressed = true;
      }
      if (event.key === 'd') {
        this._rightPressed = true;
      }
      if (event.key === 'w') {
        this._forwardPressed = true;
      }
      if (event.key === 'PageUp') {
        this._upPressed = true;
      }
      if (event.key === 'PageDown') {
        this._downPressed = true;
      }
    });

    document.addEventListener('keyup', (event: KeyboardEvent) => {
      if (event.key === ' ') {
        this._settingsObject.forceActive = false;
        this._xAxisMat.linewidth = this._yAxisMat.linewidth = this._zAxisMat.linewidth = 2.0;
      }
      if (event.key === 'a') {
        this._leftPressed = false;
      }
      if (event.key === 's') {
        this._backPressed = false;
      }
      if (event.key === 'd') {
        this._rightPressed = false;
      }
      if (event.key === 'w') {
        this._forwardPressed = false;
      }
      if (event.key === 'PageUp') {
        this._upPressed = false;
      }
      if (event.key === 'PageDown') {
        this._downPressed = false;
      }
    });
  }

  public update(): void {
    const newPosition: THREE.Vector3 = this._settingsObject.forcePosition.clone();

    if (this._leftPressed) {
      newPosition.x -= this._movementSpeed;
    }
    if (this._rightPressed) {
      newPosition.x += this._movementSpeed;
    }
    if (this._forwardPressed) {
      newPosition.z -= this._movementSpeed;
    }
    if (this._backPressed) {
      newPosition.z += this._movementSpeed;
    }
    if (this._upPressed) {
      newPosition.y += this._movementSpeed;
    }
    if (this._downPressed) {
      newPosition.y -= this._movementSpeed;
    }

    const epsilon = 0.001;

    if (
      newPosition.x >= this._negativeHalfBounding.x - epsilon &&
      newPosition.x <= this._halfBounding.x + epsilon &&
      newPosition.y >= this._negativeHalfBounding.y - epsilon &&
      newPosition.y <= this._halfBounding.y + epsilon &&
      newPosition.z >= this._negativeHalfBounding.z - epsilon &&
      newPosition.z <= this._halfBounding.z + epsilon
    ) {
      this._crossHair.position.copy(newPosition);
      this._settingsObject.forcePosition.copy(newPosition);
    }
  }

  public resize(w: number, h: number): void {
    this._xAxisMat.resolution.set(w, h);
    this._yAxisMat.resolution.set(w, h);
    this._zAxisMat.resolution.set(w, h);
  }
}
