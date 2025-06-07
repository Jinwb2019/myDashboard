//initialize models
const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass')(require('sass')); //updated
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const babel = require('gulp-babel');
const terser = require('gulp-terser');
const browserSync = require('browser-sync').create();

// deleted: Use dart-saass for @use
// sass.compiler = require('dart-sass');

// sass task
function scssTask() {
    return src('app/scss/style.scss', { sourcemaps: true })
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(dest('dist', { sourcemaps: '.' }))
}

// js task
function jsTask() {
    return src('app/js/script.js', { sourcemaps: true })
        .pipe(babel({
            presets: ['@babel/preset-env']
        }))
        .pipe(terser())
        .pipe(dest('dist', { sourcemaps: '.' }));
}

// browserSync task
function browserSyncServe(cb) {
    browserSync.init({
        server: {
            baseDir: '.'
        },
        notify: {
            styles: {
                'top': 'auto',
                'bottom': '0',
            },
        },
    });
    cb();
}
function browserSyncReload(cb) {
    browserSync.reload();
    cb();
}

// watch task
function watchTask() {
    watch('*.html', browserSyncReload);
    watch(
        ['app/scss/**/*.scss', 'app/**/*.js'],
        series(scssTask, jsTask, browserSyncReload)
    );
}

// default gulp task
exports.default = series(
    scssTask,
    jsTask,
    browserSyncServe,
    watchTask
);


