import { dom, library } from '@fortawesome/fontawesome-svg-core';
import { faBars, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import * as $ from 'jquery';
import { ParticleEngine } from './particleEngine';

document.addEventListener('DOMContentLoaded', () => {
  // We are only using the user-astronaut icon
  library.add(faBars, faTimesCircle);

  // Replace any existing <i> tags with <svg> and set up a MutationObserver to
  // continue doing this as the DOM changes.
  dom.watch();

  const engine = new ParticleEngine('renderCanvas');

  if (!engine.supportsWebGL2WithCompute()) {
    const webgl2ComputeSpec = 'https://www.khronos.org/registry/webgl/specs/latest/2.0-compute/';
    const googleGroupUrl = 'https://groups.google.com/a/chromium.org/d/topic/blink-dev/bPD47wqY-r8/discussion';

    $(document.body).html(`
      <div id="noWebGL2WithCompute">
        Your browser does not support WebGL 2.0 Compute Shader<br>
        You need a browser like Chrome Canary or Edge Canary<br>
        Additional information:<br>
        <ul>
          <li><a href="${webgl2ComputeSpec}">WebGL 2.0 Compute Specification</a></li>
          <li><a href="${googleGroupUrl}">Google Groups discussion</a></li>
        </ul>
      </div>
    `);
  }

  // Create the scene
  if (engine.createScene()) {
    // start rendering
    engine.startRender();
  }
});
