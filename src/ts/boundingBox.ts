import * as THREE from 'three';

require('THREE.LineMaterial'); // tslint:disable-line:no-var-requires
require('THREE.LineSegmentsGeometry'); // tslint:disable-line:no-var-requires
require('THREE.WireframeGeometry2'); // tslint:disable-line:no-var-requires
require('THREE.Wireframe'); // tslint:disable-line:no-var-requires

/* the cube:

      v5-----------v6
     / |          / |
   /   |         /  |
   v2----------v1   |
   |   |        |   |
   |   |        |   |
   |  v4--------|--v7
   | /          |  /
   |/           | /
   v3-----------v0

*/

export class BoundingBox {
  private _lineMaterial: THREE.LineMaterial;

  constructor(dimensions: THREE.Vector3, scene: THREE.Scene, w: number, h: number) {
    const halfX = dimensions.x / 2.0;
    const halfY = dimensions.y / 2.0;
    const halfZ = dimensions.z / 2.0;

    // front vertices
    const v0 = new THREE.Vector3(halfX, -halfY, halfZ);
    const v1 = new THREE.Vector3(halfX, halfY, halfZ);
    const v2 = new THREE.Vector3(-halfX, halfY, halfZ);
    const v3 = new THREE.Vector3(-halfX, -halfY, halfZ);

    // back vertices
    const v4 = new THREE.Vector3(-halfX, -halfY, -halfZ);
    const v5 = new THREE.Vector3(-halfX, halfY, -halfZ);
    const v6 = new THREE.Vector3(halfX, halfY, -halfZ);
    const v7 = new THREE.Vector3(halfX, -halfY, -halfZ);

    this._lineMaterial = new THREE.LineMaterial({
      color: 0xffffff,
      linewidth: 3.0
    });

    const lineGeometry = new THREE.LineGeometry();

    // prettier-ignore
    const positions = [
      // fron
      v0.x, v0.y, v0.z, v1.x, v1.y, v1.z,
      v1.x, v1.y, v1.z, v2.x, v2.y, v2.z,
      v2.x, v2.y, v2.z, v3.x, v3.y, v3.z,
      v3.x, v3.y, v3.z, v0.x, v0.y, v0.z,

      // left
      v3.x, v3.y, v3.z, v2.x, v2.y, v2.z,
      v2.x, v2.y, v2.z, v5.x, v5.y, v5.z,
      v5.x, v5.y, v5.z, v4.x, v4.y, v4.z,
      v4.x, v4.y, v4.z, v3.x, v3.y, v3.z,

      // right
      v0.x, v0.y, v0.z, v7.x, v7.y, v7.z,
      v7.x, v7.y, v7.z, v6.x, v6.y, v6.z,
      v6.x, v6.y, v6.z, v1.x, v1.y, v1.z,
      v1.x, v1.y, v1.z, v0.x, v0.y, v0.z,

      // back
      v7.x, v7.y, v7.z, v4.x, v4.y, v4.z,
      v4.x, v4.y, v4.z, v5.x, v5.y, v5.z,
      v5.x, v5.y, v5.z, v6.x, v6.y, v6.z,
      v6.x, v6.y, v6.z, v7.x, v7.y, v7.z,
    ];
    lineGeometry.setPositions(positions);

    const boxMesh = new THREE.Line2(lineGeometry, this._lineMaterial);
    boxMesh.computeLineDistances();

    scene.add(boxMesh);
    this.resize(w, h);
  }

  public resize(w: number, h: number): void {
    this._lineMaterial.resolution.set(w, h);
  }
}
