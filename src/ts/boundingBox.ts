import * as THREE from 'three';

export class BoundingBox {
  constructor(dimensions: THREE.Vector3, scene: THREE.Scene) {
    const geometry: THREE.BoxGeometry = new THREE.BoxGeometry(dimensions.x, dimensions.y, dimensions.z);
    const geo = new THREE.EdgesGeometry(geometry); // or WireframeGeometry( geometry )
    const mat = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2 });
    const wireframe = new THREE.LineSegments(geo, mat);
    scene.add(wireframe);
  }
}
