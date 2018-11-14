import * as THREE from 'three';
import { ISettings } from './settingsGui';

require('THREE.LineMaterial'); // tslint:disable-line:no-var-requires
require('THREE.LineSegmentsGeometry'); // tslint:disable-line:no-var-requires
require('THREE.LineGeometry'); // tslint:disable-line:no-var-requires
require('THREE.LineSegments2'); // tslint:disable-line:no-var-requires
require('THREE.Line2'); // tslint:disable-line:no-var-requires

export class CrossHair {
  private _crossHair: THREE.Object3D;
  private _halfBounding: THREE.Vector3;
  private _negativeHalfBounding: THREE.Vector3;

  private _leftPressed: boolean = false;
  private _rightPressed: boolean = false;
  private _forwardPressed: boolean = false;
  private _backPressed: boolean = false;
  private _upPressed: boolean = false;
  private _downPressed: boolean = false;
  private _movementSpeed: number = 0.1;
  private _settingsObject: ISettings;

  private _xAxisMat: THREE.LineMaterial;
  private _yAxisMat: THREE.LineMaterial;
  private _zAxisMat: THREE.LineMaterial;

  constructor(dimensions: THREE.Vector3, bounding: THREE.Vector3, scene: THREE.Scene, settingsObject: ISettings) {
    this._settingsObject = settingsObject;
    this._halfBounding = bounding.clone().multiplyScalar(0.5);
    this._negativeHalfBounding = this._halfBounding.clone().multiplyScalar(-1.0);

    this._crossHair = new THREE.Object3D();
    scene.add(this._crossHair);

    this._xAxisMat = new THREE.LineMaterial({ color: 0xff0000, linewidth: 2.0 });
    this._xAxisMat.resolution.set(window.innerWidth, window.innerHeight);
    this._yAxisMat = new THREE.LineMaterial({ color: 0x00ff00, linewidth: 2.0 });
    this._yAxisMat.resolution.set(window.innerWidth, window.innerHeight);
    this._zAxisMat = new THREE.LineMaterial({ color: 0x0000ff, linewidth: 2.0 });
    this._zAxisMat.resolution.set(window.innerWidth, window.innerHeight);

    const xAxisGeometry = new THREE.LineGeometry();
    xAxisGeometry.setPositions([
      -dimensions.x / 2, 0.0, 0.0,
      dimensions.x / 2, 0.0, 0.0
    ]);

    const yAxisGeometry = new THREE.LineGeometry();
    yAxisGeometry.setPositions([
      0.0, -dimensions.y / 2, 0.0,
      0.0, dimensions.y / 2, 0.0
    ]);

    const zAxisGeometry = new THREE.LineGeometry();
    zAxisGeometry.setPositions([
      0.0, 0.0, -dimensions.z / 2,
      0.0, 0.0, dimensions.z / 2
    ]);

    /*
    const xAxis = new THREE.Line2(xAxisGeometry, xAxisMat);
    xAxis.computeLineDistances();
    xAxis.scale.set(1, 1, 1);
    */

    this._crossHair.add(new THREE.Line2(xAxisGeometry, this._xAxisMat));
    this._crossHair.add(new THREE.Line2(yAxisGeometry, this._yAxisMat));
    this._crossHair.add(new THREE.Line2(zAxisGeometry, this._zAxisMat));


    document.addEventListener('keydown', (event: KeyboardEvent) => {
      switch (event.key) {
        case ' ':
          this._settingsObject.forceActive = true;
          this._xAxisMat.linewidth = this._yAxisMat.linewidth = this._zAxisMat.linewidth = 5.0;
          break;
        case 'a':
          this._leftPressed = true;
          break;
        case 's':
          this._backPressed = true;
          break;
        case 'd':
          this._rightPressed = true;
          break;
        case 'w':
          this._forwardPressed = true;
          break;
        case 'PageUp':
          this._upPressed = true;
          break;
        case 'PageDown':
          this._downPressed = true;
          break;

      }
    });

    document.addEventListener('keyup', (event: KeyboardEvent) => {
      switch (event.key) {
        case ' ':
          this._settingsObject.forceActive = false;
          this._xAxisMat.linewidth = this._yAxisMat.linewidth = this._zAxisMat.linewidth = 2.0;
          break;
        case 'a':
          this._leftPressed = false;
          break;
        case 's':
          this._backPressed = false;
          break;
        case 'd':
          this._rightPressed = false;
          break;
        case 'w':
          this._forwardPressed = false;
          break;
        case 'PageUp':
          this._upPressed = false;
          break;
        case 'PageDown':
          this._downPressed = false;
          break;
      }
    });

  }

  public update(): void {
    const newPosition: THREE.Vector3 = this._settingsObject.forcePosition.clone();

    if (this._leftPressed) {
      newPosition.x -= this._movementSpeed;
    } else if (this._rightPressed) {
      newPosition.x += this._movementSpeed;
    } else if (this._forwardPressed) {
      newPosition.z -= this._movementSpeed;
    } else if (this._backPressed) {
      newPosition.z += this._movementSpeed;
    } else if (this._upPressed) {
      newPosition.y += this._movementSpeed;
    } else if (this._downPressed) {
      newPosition.y -= this._movementSpeed;
    }

    if (newPosition.x > this._negativeHalfBounding.x && newPosition.x < this._halfBounding.x &&
      newPosition.y > this._negativeHalfBounding.y && newPosition.y < this._halfBounding.y &&
      newPosition.z > this._negativeHalfBounding.z && newPosition.z < this._halfBounding.z) {
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
