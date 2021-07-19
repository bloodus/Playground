/*  ------------------------------------ */
/*  Edit this part to match your project */


/* PATHS */
const paths = {
    html: {
        src: '*.php',
    },
    css: {
        src: 'src/scss/**/*.scss',
        dist: 'dist/css',
    },
    js: {
        src: 'src/scripts/*.js',
        dist: 'dist/js',
    },
    localhost: {
        // Provide path to your localhost project
        url: 'http://playground.localhost/',
    }
}

// List all browsers you use for testing on your local machine
const browserList = ["google chrome", "firefox", "safari"];

/*  STOP EDITING AFTER THIS POINT */
/*  ----------------------------- */


/*  ------------ GULP SETUP ------------ */
/* MODULES */

const { src, dest, watch, series } = require('gulp'),
    sass = require('gulp-sass')(require('sass'));
    postcss = require('gulp-postcss'),
    cssnano = require('cssnano'),
    terser = require('gulp-terser'),
    rename = require("gulp-rename"),
    autoprefixer = require('autoprefixer'),
    browserSync = require('browser-sync').create();

/* TASKS */
/* BrowserSync settings: https://browsersync.io/docs/options */
function browsersyncInit(cb){
    browserSync.init({
        proxy: {
            target: paths.localhost.url,
        },
        logLevel: "debug",
    });
    cb();
}

function browsersyncAllBrowsers(cb){
    browserSync.init({
        proxy: {
            target: paths.localhost.url,
        },
        logLevel: "debug",
        browser: browserList,
    });
    cb();
}

function browsersyncReload(cb) {
    browserSync.reload();
    cb();  // Reload browsers
}

function compileScss() {
  return src([paths.css.src], { sourcemaps: true })
    .pipe(sass({outputStyle: 'expanded',})).on('error', sass.logError)
    .pipe(dest('site/templates/src/dev'))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(rename("styles.min.css"))
    .pipe(dest(paths.css.dist, { sourcemaps: true }))
}

function compileJs() {
    return src(paths.js.src, { sourcemaps: true })
    .pipe(terser())
    .pipe(rename("scripts.min.js"))
    .pipe(dest(paths.js.dist, { sourcemaps: true }));
}

function watchChanges(){
    watch(paths.html.src, browsersyncReload);
    watch(paths.css.src, series(compileScss, browsersyncReload));
    watch(paths.js.src, series(compileJs, browsersyncReload));
}

/* EXPORT TASKS */
exports.compile = series(
    compileScss,
    compileJs
);

exports.browsers = series(
    compileScss,
    compileJs,
    browsersyncAllBrowsers,
    watchChanges
);

exports.default = series(
    compileScss,
    compileJs,
    browsersyncInit,
    watchChanges
);