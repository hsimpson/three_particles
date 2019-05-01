'use strict';

const config = {
  distDirectory: 'dist',
  htmlSrc: 'src/html/index.html',
  cssSrc: 'src/css/*.css',
  fontSrc: 'src/fonts/*',
  typescriptSrc: 'src/ts/**/*.ts',
  shaderSrc: 'src/shaders/**/*.{comp, vert, frag}',
  thirdparty: {
    scripts: [
      {
        expose: '@fortawesome/fontawesome-svg-core',
        noparse: true,
        path: './node_modules/@fortawesome/fontawesome-svg-core/index.js'
      },
      {
        expose: '@fortawesome/free-solid-svg-icons',
        noparse: true,
        path: './node_modules/@fortawesome/free-solid-svg-icons/index.js'
      },
      {
        expose: 'jquery',
        noparse: true,
        path: './node_modules/jquery/dist/jquery.min.js'
      },
      {
        expose: 'vanilla-picker',
        noparse: true,
        path: './node_modules/vanilla-picker/dist/vanilla-picker.js'
      },
      {
        expose: 'three',
        noparse: true,
        //path: './node_modules/three/build/three.js'
        path: './libs/three.js'
      },
      {
        expose: 'THREE.LineSegments2',
        noparse: true,
        path: './node_modules/three/examples/js/lines/LineSegments2.js'
      },
      {
        expose: 'THREE.Line2',
        noparse: true,
        path: './node_modules/three/examples/js/lines/Line2.js'
      },
      {
        expose: 'THREE.LineGeometry',
        noparse: true,
        path: './node_modules/three/examples/js/lines/LineGeometry.js'
      },
      {
        expose: 'THREE.LineSegmentsGeometry',
        noparse: true,
        path: './node_modules/three/examples/js/lines/LineSegmentsGeometry.js'
      },
      {
        expose: 'THREE.LineMaterial',
        noparse: true,
        path: './node_modules/three/examples/js/lines/LineMaterial.js'
      },
      {
        expose: 'THREE.WireframeGeometry2',
        noparse: true,
        path: './node_modules/three/examples/js/lines/WireframeGeometry2.js'
      },
      {
        expose: 'THREE.Wireframe',
        noparse: true,
        path: './node_modules/three/examples/js/lines/Wireframe.js'
      },
      {
        expose: 'THREE.TrackballControls',
        noparse: true,
        path: './node_modules/three/examples/js/controls/TrackballControls.js'
      }
    ],
    styles: []
  }
};

module.exports = config;
