import { Color, BufferGeometry, InstancedBufferGeometry, Geometry, Mesh, ShaderMaterial, ShaderMaterialParameters } from 'three';

declare module 'THREE' {

  export interface LineMaterialParameters extends ShaderMaterialParameters {
    color?: Color | string | number;
    linewidth?: number;
    dashed?: boolean;

  }

  export class LineMaterial extends ShaderMaterial {
    resolution: THREE.Vector2;
    constructor(parameters?: LineMaterialParameters);

  }

  export class LineSegmentsGeometry extends InstancedBufferGeometry {

  }

  export class LineGeometry extends LineSegmentsGeometry {
    setPositions(array: number[]): LineGeometry;
  }

  export class LineSegments2 extends Mesh { }
  export class Line2 extends LineSegments2 {
    computeLineDistances(): Line2;
  }

  export class WireframeGeometry2 extends LineSegmentsGeometry {
    constructor(geometry: Geometry | BufferGeometry);
  }

  export class Wireframe extends Mesh { }
}
