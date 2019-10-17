import '../scss/app.scss';
import { dom, library } from '@fortawesome/fontawesome-svg-core';
import { faBars, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import $ from 'jquery';
import { ParticleEngine } from './particleEngine';

document.addEventListener('DOMContentLoaded', () => {
  // We are only using the user-astronaut icon
  library.add(faBars, faTimesCircle);

  // Replace any existing <i> tags with <svg> and set up a MutationObserver to
  // continue doing this as the DOM changes.
  dom.watch();

  const engine = new ParticleEngine('renderCanvas');

  if (engine.supportsWebGL2WithCompute()) {
    // Create the scene
    if (engine.createScene()) {
      // start rendering
      engine.startRender();
    }
  } else {
    const webgl2ComputeSpec = 'https://www.khronos.org/registry/webgl/specs/latest/2.0-compute/';
    const googleGroupUrl = 'https://groups.google.com/a/chromium.org/d/topic/blink-dev/bPD47wqY-r8/discussion';
    const webgl2ComputDemos = 'https://github.com/9ballsyndrome/WebGL_Compute_shader';

    $(document.body).html(`
      <div id="noWebGL2WithCompute">
        Your browser does not support WebGL 2.0 Compute Shader<br>
        You need a browser like Chrome Canary or Edge Canary<br>
        <br>
        <br>
        To setup this browser you need some flags:
        <ul>
          <li>
            <p><code>--enable-webgl2-compute-context</code><br>
            Enable WebGL Compute shader, WebGL2ComputeRenderingContext<br>
            Or you can enable this flag via about://flags/ if using the corresponding version, choose "WebGL 2.0 Compute"</p>
          </li>
          <li>
            <p><code>--use-angle=gl</code><br>
            Run ANGLE with OpenGL backend because Shader Storage Buffer Object is now on implementing and there are some use cases which do not work well on D3D backend yet<br>
            Some demos in this page need this flag<br>
            Or you can enable this flag via about://flags/, choose "Choose ANGLE graphics backend"</p>
          </li>
          <li>
            <p><code>--use-cmd-decoder=passthrough</code><br>
            In some environments, it could run well only after adding this flag. So try this if could not work with above two flags</p>
          </li>
          <li>
            <p><code>--use-gl=angle</code><br>
            Run OpenGL with ANGLE. On Linux, you must specify this explicitly. On Windows, this flag is not needed because ANGLE will be used by default</p>
          </li>
        </ul>

        <br>
        Additional information:<br>
        <ul>
          <li><a href="${webgl2ComputeSpec}" target="_blank">WebGL 2.0 Compute Specification</a></li>
          <li><a href="${googleGroupUrl}" target="_blank">Google Groups discussion</a></li>
          <li><a href="${webgl2ComputDemos}" target="_blank">WebGL 2.0 Compute shader Demos</a></li>
        </ul>
      </div>
    `);
  }
});
