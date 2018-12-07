'use strict';

const { src, dest, series, parallel, watch } = require('gulp');
const del = require('del');
const connect = require('gulp-connect');
const sourcemaps = require('gulp-sourcemaps');
const browserify = require('browserify');
const tsify = require('tsify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const concat = require('gulp-concat');

const config = require('./gulp/config');

function clean() {
  return del(config.distDirectory);
}

function buildHtml() {
  return src(config.htmlSrc).pipe(dest(config.distDirectory));
}

function buildFonts() {
  return src(config.fontSrc).pipe(dest(`${config.distDirectory}/fonts`));
}

function buildCss() {
  return src(config.cssSrc)
    .pipe(concat('app.css'))
    .pipe(dest(`${config.distDirectory}/css`));
}

function buildTypeScript() {
  const b = browserify({
    debug: true,
    entries: ['src/ts/app.ts']
  }).plugin(tsify);

  config.thirdparty.scripts.forEach((external) => {
    b.external(external.expose);
  });

  return b
    .bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(
      sourcemaps.init({
        loadMaps: true
      })
    )
    .pipe(sourcemaps.write())
    .pipe(dest(`${config.distDirectory}/js`));
}

function buildThirdpartyJS() {
  let noparse = [];

  config.thirdparty.scripts.forEach((external) => {
    if (external.noparse) {
      noparse.push(external.path);
    }
  });

  const b = browserify({
    debug: true,
    noParse: noparse
  });

  config.thirdparty.scripts.forEach((external) => {
    b.require(external.path, {
      expose: external.expose
    });
  });

  return b
    .bundle()
    .pipe(source('thirdparty.js'))
    .pipe(buffer())
    .pipe(
      sourcemaps.init({
        loadMaps: true
      })
    )
    .pipe(sourcemaps.write())
    .pipe(dest(`${config.distDirectory}/js`));
}

/*
function buildThirdpartyCss() {
  return src(config.thirdparty.styles)
    .pipe(concat('thirdparty.css'))
    .pipe(dest(`${config.distDirectory}/css`));
}
*/

function watchHtml() {
  return watch(config.htmlSrc, buildHtml);
}

function watchFonts() {
  return watch(config.fontSrc, buildFonts);
}

function watchCss() {
  return watch(config.cssSrc, buildCss);
}

function watchTypeScript() {
  return watch([config.typescriptSrc, 'tsconfig.json'], buildTypeScript);
}

function webServer() {
  return connect.server({
    root: config.distDirectory
  });
}

const build = parallel(buildHtml, buildFonts, buildCss, buildTypeScript, buildThirdpartyJS /*, buildThirdpartyCss*/);
const defaultTask = series(clean, build);

exports.default = defaultTask;
exports.develop = series(defaultTask, parallel(webServer, watchHtml, watchFonts, watchCss, watchTypeScript));
