import * as THREE from 'three';
import { ISettings } from './settingsGui';

export class ParticleRenderer {
  private _settingsObject: ISettings;
  private _particleGeometry: THREE.BufferGeometry;
  private _particleMaterial: THREE.PointsMaterial;

  constructor(scene: THREE.Scene, settingsObject: ISettings) {
    this._settingsObject = settingsObject;
    this._particleGeometry = new THREE.BufferGeometry();

    this._particleMaterial = new THREE.PointsMaterial({
      size: this._settingsObject.particleSize,
      color: new THREE.Color(this._settingsObject.color.x, this._settingsObject.color.y, this._settingsObject.color.z),
      opacity: this._settingsObject.color.w
    });

    const points = new THREE.Points(this._particleGeometry, this._particleMaterial);
    scene.add(points);
  }

  public update(): void {
    let needsUpdate = false;

    if (this._particleMaterial.size !== this._settingsObject.particleSize) {
      this._particleMaterial.size = this._settingsObject.particleSize;
      needsUpdate = true;
    }

    if (
      this._particleMaterial.color.r !== this._settingsObject.color.x ||
      this._particleMaterial.color.g !== this._settingsObject.color.y ||
      this._particleMaterial.color.b !== this._settingsObject.color.z
    ) {
      this._particleMaterial.color.setRGB(
        this._settingsObject.color.x,
        this._settingsObject.color.y,
        this._settingsObject.color.z
      );
      needsUpdate = true;
    }

    if (this._particleMaterial.opacity !== this._settingsObject.color.w) {
      this._particleMaterial.opacity = this._settingsObject.color.w;
      needsUpdate = true;
    }

    this._particleMaterial.needsUpdate = needsUpdate;
  }
}
