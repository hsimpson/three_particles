import * as THREE from 'three';
import { ISettings } from './settingsGui';

export class ParticleRenderer {
  private _gl: WebGL2ComputeRenderingContext;
  private _threeCamera: THREE.PerspectiveCamera;
  private _settingsObject: ISettings;
  private _boundingBox: THREE.Vector3;
  private _particleCount: number = 0;
  private _computeProgram: WebGLProgram;

  private _shadingProgram: WebGLProgram;

  // compute shader uniform locations
  private _initLoc: WebGLUniformLocation;
  private _particleCountLoc: WebGLUniformLocation;
  private _boundingBoxLoc: WebGLUniformLocation;
  private _deltaTimeLoc: WebGLUniformLocation;
  private _gravityLoc: WebGLUniformLocation;
  private _forceOnLoc: WebGLUniformLocation;
  private _forcePositionsloc: WebGLUniformLocation;
  private _forceLoc: WebGLUniformLocation;

  // draw shader uniform locations
  private _projectionMatrixLoc: WebGLUniformLocation;
  private _viewMatrixLoc: WebGLUniformLocation;
  private _colorLoc: WebGLUniformLocation;
  private _pointSizeLoc: WebGLUniformLocation;

  private _vao: WebGLVertexArrayObject;
  private _posBuffer: WebGLBuffer;
  private _velBuffer: WebGLBuffer;

  private _lastTime: number = 0;
  private _dispatchGroups: number;

  constructor(
    context: WebGL2ComputeRenderingContext,
    camera: THREE.PerspectiveCamera,
    settingsObject: ISettings,
    bounding: THREE.Vector3
  ) {
    this._gl = context;
    this._threeCamera = camera;
    this._settingsObject = settingsObject;
    this._boundingBox = bounding;
  }

  public init(): boolean {
    this._logComputeThings();

    // create compute shader
    const computeShaderSource = require('../shaders/particle_compute.comp');
    const computeShader = this._gl.createShader(this._gl.COMPUTE_SHADER);
    this._gl.shaderSource(computeShader, computeShaderSource);
    this._gl.compileShader(computeShader);
    if (!this._gl.getShaderParameter(computeShader, this._gl.COMPILE_STATUS)) {
      console.error(this._gl.getShaderInfoLog(computeShader));
      return false;
    }

    // create compute shader program
    this._computeProgram = this._gl.createProgram();
    this._gl.attachShader(this._computeProgram, computeShader);
    this._gl.linkProgram(this._computeProgram);
    if (!this._gl.getProgramParameter(this._computeProgram, this._gl.LINK_STATUS)) {
      console.error(this._gl.getProgramInfoLog(this._computeProgram));
      return false;
    }

    // get the compute shader uniform locations
    this._initLoc = this._gl.getUniformLocation(this._computeProgram, 'uiInit');
    this._particleCountLoc = this._gl.getUniformLocation(this._computeProgram, 'uiParticleCount');
    this._boundingBoxLoc = this._gl.getUniformLocation(this._computeProgram, 'v3BoundingBox');
    this._deltaTimeLoc = this._gl.getUniformLocation(this._computeProgram, 'fDeltaTime');
    this._gravityLoc = this._gl.getUniformLocation(this._computeProgram, 'fGravity');
    this._forceOnLoc = this._gl.getUniformLocation(this._computeProgram, 'uiForce');
    this._forcePositionsloc = this._gl.getUniformLocation(this._computeProgram, 'v3ForcePostion');
    this._forceLoc = this._gl.getUniformLocation(this._computeProgram, 'fForce');

    // create vertex array object
    this._vao = this._gl.createVertexArray();

    // create the buffers
    this._posBuffer = this._gl.createBuffer();
    this._velBuffer = this._gl.createBuffer();

    // create vertex shader
    const particleVertexShaderSource = require('../shaders/particle.vert');
    const particleVertexShader = this._gl.createShader(this._gl.VERTEX_SHADER);
    this._gl.shaderSource(particleVertexShader, particleVertexShaderSource);
    this._gl.compileShader(particleVertexShader);
    if (!this._gl.getShaderParameter(particleVertexShader, this._gl.COMPILE_STATUS)) {
      console.log(this._gl.getShaderInfoLog(particleVertexShader));
      return false;
    }

    const particleFragmentShaderSource = require('../shaders/particle.frag');
    const particleFragmentShader = this._gl.createShader(this._gl.FRAGMENT_SHADER);
    this._gl.shaderSource(particleFragmentShader, particleFragmentShaderSource);
    this._gl.compileShader(particleFragmentShader);
    if (!this._gl.getShaderParameter(particleFragmentShader, this._gl.COMPILE_STATUS)) {
      console.log(this._gl.getShaderInfoLog(particleFragmentShader));
      return false;
    }

    // create shader program
    this._shadingProgram = this._gl.createProgram();
    this._gl.attachShader(this._shadingProgram, particleVertexShader);
    this._gl.attachShader(this._shadingProgram, particleFragmentShader);
    this._gl.linkProgram(this._shadingProgram);
    if (!this._gl.getProgramParameter(this._shadingProgram, this._gl.LINK_STATUS)) {
      console.error(this._gl.getProgramInfoLog(this._shadingProgram));
      return false;
    }

    this._gl.bindVertexArray(this._vao);
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._posBuffer);

    //this._gl.bufferData(this._gl.ARRAY_BUFFER, this._randomInit(), this._gl.STATIC_DRAW);

    this._gl.enableVertexAttribArray(0);
    this._gl.vertexAttribPointer(0, 4, this._gl.FLOAT, false, 0, 0);

    this._projectionMatrixLoc = this._gl.getUniformLocation(this._shadingProgram, 'u_projectionMatrix');
    this._viewMatrixLoc = this._gl.getUniformLocation(this._shadingProgram, 'u_viewMatrix');
    this._colorLoc = this._gl.getUniformLocation(this._shadingProgram, 'u_color');
    this._pointSizeLoc = this._gl.getUniformLocation(this._shadingProgram, 'u_pointSize');

    this._gl.bindVertexArray(null);

    this._gl.enable(this._gl.BLEND);
    this._gl.blendFunc(this._gl.SRC_ALPHA, this._gl.ONE);

    return true;
  }

  public update(time: number): void {
    const duration = time - this._lastTime;
    this._lastTime = time;

    const runmode = this._resizeBuffers() ? 1 : 0;

    // compute

    this._gl.useProgram(this._computeProgram);

    this._gl.uniform1ui(this._initLoc, runmode); // fix this
    this._gl.uniform1ui(this._particleCountLoc, this._particleCount);
    this._gl.uniform3fv(this._boundingBoxLoc, this._boundingBox.toArray());
    this._gl.uniform1f(this._deltaTimeLoc, duration);
    this._gl.uniform1f(this._gravityLoc, this._settingsObject.gravity);
    this._gl.uniform1ui(this._forceOnLoc, this._settingsObject.forceActive ? 1 : 0);
    this._gl.uniform3fv(this._forcePositionsloc, this._settingsObject.forcePosition.toArray());
    this._gl.uniform1f(this._forceLoc, this._settingsObject.force);
    this._gl.dispatchCompute(this._dispatchGroups, 1, 1);
    this._gl.memoryBarrier(this._gl.VERTEX_ATTRIB_ARRAY_BARRIER_BIT);

    // rendering
    this._gl.useProgram(this._shadingProgram);
    this._gl.bindVertexArray(this._vao);

    this._gl.uniformMatrix4fv(this._projectionMatrixLoc, false, this._threeCamera.projectionMatrix.toArray());
    this._gl.uniformMatrix4fv(this._viewMatrixLoc, false, this._threeCamera.matrixWorldInverse.toArray());
    this._gl.uniform4fv(this._colorLoc, this._settingsObject.color.toArray());
    this._gl.uniform1f(this._pointSizeLoc, this._settingsObject.particleSize);

    this._gl.drawArrays(this._gl.POINTS, 0, this._particleCount);

    this._gl.bindVertexArray(null);
  }

  private _logComputeThings(): void {
    const maxComputeWorkGroupCount = [];
    const maxComputeWorkGroupSize = [];

    for (let i = 0; i < 3; i++) {
      maxComputeWorkGroupCount.push(this._gl.getIndexedParameter(this._gl.MAX_COMPUTE_WORK_GROUP_COUNT, i));
      maxComputeWorkGroupSize.push(this._gl.getIndexedParameter(this._gl.MAX_COMPUTE_WORK_GROUP_SIZE, i));
    }
    console.log(`max global (total) work group sizes ${maxComputeWorkGroupCount.join()}`);
    console.log(`max local (in one shader) work group sizes ${maxComputeWorkGroupSize.join()}`);
    console.log(
      `max local work group invocations: ${this._gl.getParameter(this._gl.MAX_COMPUTE_WORK_GROUP_INVOCATIONS)}`
    );
  }

  private _resizeBuffers(): boolean {
    const newParticleCount = Math.pow(this._settingsObject.particlesPerDimension, 3);
    if (newParticleCount !== this._particleCount) {
      this._particleCount = newParticleCount;

      this._dispatchGroups = Math.trunc(this._particleCount / 1024) + 1;

      /**/
      this._gl.bindBuffer(this._gl.SHADER_STORAGE_BUFFER, this._posBuffer);
      this._gl.bufferData(
        this._gl.SHADER_STORAGE_BUFFER,
        new Float32Array(this._particleCount * 4),
        this._gl.DYNAMIC_COPY
      );
      this._gl.bindBufferBase(this._gl.SHADER_STORAGE_BUFFER, 0, this._posBuffer);

      this._gl.bindBuffer(this._gl.SHADER_STORAGE_BUFFER, this._velBuffer);
      this._gl.bufferData(
        this._gl.SHADER_STORAGE_BUFFER,
        new Float32Array(this._particleCount * 4),
        this._gl.DYNAMIC_COPY
      );
      this._gl.bindBufferBase(this._gl.SHADER_STORAGE_BUFFER, 1, this._velBuffer);
      /**/

      /*/
      this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._posBuffer);
      this._gl.bufferData(this._gl.ARRAY_BUFFER, this._randomInit(), this._gl.STATIC_DRAW);
      /**/

      return true;
    }
    return false;
  }

  private _randomInit(): Float32Array {
    const vertices = new Float32Array(this._particleCount * 4);

    // calc cubic root
    const n = Math.pow(this._particleCount, 1.0 / 3.0);
    const dx = this._boundingBox.x / (n + 1.0);
    const dy = this._boundingBox.y / (n + 1.0);
    const dz = this._boundingBox.z / (n + 1.0);

    for (let i = 0; i < this._particleCount; i++) {
      const px = (i % n) * dx + dx - this._boundingBox.x / 2;
      const py = Math.trunc((i / n) % n) * dy + dy - this._boundingBox.y / 2;
      const pz = Math.trunc((i / Math.pow(n, 2)) % n) * dz + dz - this._boundingBox.z / 2;

      let vi = i * 4;
      vertices[vi] = px;
      vertices[++vi] = py;
      vertices[++vi] = pz;
      vertices[++vi] = 0; // 4th component
    }

    return vertices;
  }
}
