const gulp = require('gulp');
var rollup = require('rollup-stream');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');

function transpileJS() {
  return rollup({
      input: './src/main.js',
      sourcemap: true,
      format: 'umd',
      name: 'file'
    })
    .pipe(source('index.js', './src'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))

    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist'));
}

exports.default = gulp.series(transpileJS);