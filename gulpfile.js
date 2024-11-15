const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));  // Dart Sass
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const babel = require('gulp-babel');
const terser = require('gulp-terser');
const browsersync = require('browser-sync').create();

// Sass Task
function scssTask() {
  return src('app/scss/style.scss', { sourcemaps: true })  // Input file path
    .pipe(sass().on('error', sass.logError))  // Compile Sass to CSS, with error handling
    .pipe(postcss([autoprefixer(), cssnano()]))  // Apply autoprefixer and minify CSS
    .pipe(dest('dist', { sourcemaps: '.' }));  // Output the compiled CSS to dist folder
}


// JavaScript Task
function jsTask() {
  return src('app/js/script.js', { sourcemaps: true })
    .pipe(babel({ presets: ['@babel/preset-env'] }))  // Babel for JavaScript transpiling
    .pipe(terser())  // Minify JavaScript
    .pipe(dest('dist', { sourcemaps: '.' }));
}

// BrowserSync Task
function browserSyncServe(cb) {
  browsersync.init({
    server: { baseDir: '.' },
    notify: false,  // Disable notification to simplify
  });
  cb();
}

// BrowserSync Reload Task
function browserSyncReload(cb) {
  browsersync.reload();
  cb();
}

// Watch Task
function watchTask() {
  watch('*.html', browserSyncReload);  // Watch HTML files for changes
  watch(['app/scss/**/*.scss', 'app/**/*.js'], series(scssTask, jsTask, browserSyncReload));  // Watch Sass and JS files
}


// Default Gulp Task
exports.default = series(scssTask, jsTask, browserSyncServe, watchTask);

// Build Gulp Task
exports.build = series(scssTask, jsTask);  // For production build
