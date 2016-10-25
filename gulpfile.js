'use strict';
const assets = 'assets/';
const source = 'src/';
const dest = 'dist/';

// Load plugins
const _ = require('lodash');
const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const postcss = require('gulp-postcss');
const less = require('gulp-less');
const normalize = require('postcss-normalize');
const autoprefixer = require('autoprefixer');
const cleancss = require('gulp-clean-css');
const rename = require('gulp-rename');
const browserSync = require('browser-sync').create();
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const del = require('del');
const nunjucks = require('gulp-nunjucks-render');
const data = require('gulp-data');
const fs = require('fs');
const fontmin = require('gulp-fontmin');
const gutil = require('gulp-util');
const plumber = require('gulp-plumber');

const processors = [
  normalize,
  autoprefixer({browsers: ['last 2 versions']})
];
const cleanCssOpts = {
  advanced: false,
  keepSpecialComments: 0
}

// HTML Templating and data injection
gulp.task('nunjucks', () => {
  return gulp.src(`${source}*.+(html|njk)`)
    .pipe(data(() => {
      return JSON.parse(fs.readFileSync(`${source}data/data.json`))
    }))
    .pipe(nunjucks({
      path: [`${source}templates`]
    }))
    .pipe(gulp.dest(`${dest}`))
});

// compile and minify styles
gulp.task('styles', () => {
  return gulp.src(`${source}${assets}styles/main.less`)
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(less().on('error', err => {
        gutil.log(err);
        this.emit('end');
      })
    )
    .pipe(postcss(processors))
    .pipe(cleancss(cleanCssOpts))
    .pipe(rename('main.min.css'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(`${dest}styles`))
    .pipe(browserSync.reload({stream:true}));
});

// compress and copy images
gulp.task('images', () => {
  return gulp.src(`${source}${assets}img/*`)
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()]
    }))
    .pipe(gulp.dest(`${dest}img`))
    .pipe(browserSync.reload({stream:true}));
});

// move font files
gulp.task('fonts', () => {
  return gulp.src(`${source}${assets}fonts/*.ttf`)
    .pipe(fontmin())
    .pipe(gulp.dest(`${dest}fonts`));
});

// concatenate and minify javascript
gulp.task('scripts', () => {
  return gulp.src([`${source}${assets}js/*.js`])
    .pipe(concat('main.js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest(`${dest}js`))
    .pipe(browserSync.reload({stream:true}));
});

// copy static files
gulp.task('static', () => {
  return gulp.src(`*.+(xml|txt)`)
    .pipe(gulp.dest(`${dest}`));
});

// start BrowserSync
gulp.task('browser-sync', () => {
  browserSync.init({
    server: {
      baseDir: `${dest}`
    },
    host: "localhost"
  });
});

// clean up assets folder
gulp.task('clean', () => {
  del([`${dest}styles`, `${dest}js`, `${dest}img`])
});

// build files and watch for changes
gulp.task('watch', ['clean'], () => {
  gulp.start('nunjucks', 'styles', 'scripts', 'images');
  gulp.watch([`${source}templates/**/**/*.+(html|njk)`, `${source}templates/**/*.+(html|njk)`, `${source}templates/*.+(html|njk)`], ['nunjucks']);
  gulp.watch([`${source}${assets}styles/*.*`, `${source}${assets}styles/shared/*.less`], ['styles']);
  gulp.watch(`${source}${assets}js/*.*`, ['scripts']);
  gulp.watch(`${source}${assets}img/*.*`, ['images']);
  gulp.watch(`${source}data/*.json`, ['nunjucks']);
  gulp.watch(`${dest}index.html`).on('change', browserSync.reload);
});

// build task to populate assets
gulp.task('build', ['clean'], () => {
  gulp.start('nunjucks', 'fonts', 'styles', 'scripts', 'images', 'static');
});

// default task kicks off the build, runs BrowserSync, and watches for changes
gulp.task('default', () => {
  gulp.start('build', 'browser-sync', 'watch');
});
