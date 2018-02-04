var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var connect = require('gulp-connect');
var open = require('gulp-open');

// Compile Sass into CSS & auto-inject into browser
gulp.task('sass', function () {
  return gulp.src(['src/scss/deck.scss', 'src/scss/spectre-theme.scss', 'src/scss/style.scss'])
    .pipe(sass())
    .pipe(gulp.dest('src/css'))
    .pipe(browserSync.stream());
});

// Move Js files to /src/js folder
gulp.task('js', function () {
  return gulp.src([
      'node_modules/deck-of-cards/dist/deck.min.js', 'node_modules/pokersolver/pokersolver.js',
      'node_modules/peerjs/dist/peer.min.js'
    ])
    .pipe(gulp.dest('src/js'))
    .pipe(browserSync.stream());
});

// Move CSS files to /src/css folder
gulp.task('CSS', function () {
  return gulp.src(['node_modules/material-colors/dist/colors.css'])
    .pipe(gulp.dest('src/css'))
    .pipe(browserSync.stream());
});

// Static server + watching scss/html files
gulp.task('serve', ['sass'], function () {

  browserSync.init({
    server: './src'
  });

  gulp.watch(['src/scss/*.scss'], ['sass']);
  gulp.watch(['src/*.html', 'src/js/*.js', 'src/css/*.css']).on('change', browserSync.reload);
})

// Web server for testing
gulp.task('webserver', function () {
  connect.server({
    port: 8887,
    root: 'src',
    host: 'localhost'
  });
});

// Open browser window
gulp.task('test', ['webserver'], function () {
  var options = {
    uri: 'http://localhost:8887'
  };

  for (var i = 0; i < 4; i++) {
    gulp.src('')
      .pipe(open(options));
  }

});


gulp.task('default', ['js', 'CSS', 'serve']);
