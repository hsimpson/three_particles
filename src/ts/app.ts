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

  if (!engine.supportsWebGL2()) {
    const hintUrl = 'https://caniuse.com/#feat=webgl2';
    $(document.body).html(`<p id="noWebGL2">Your browser does not support <a href="${hintUrl}">WebGL 2.0</a></p>`);
  }

  // Create the scene
  engine.createScene();

  // start rendering
  engine.startRender();
});
