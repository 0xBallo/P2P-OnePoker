var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');

// Compile Sass into CSS & auto-inject into browser
gulp.task('sass', function () {
  return gulp.src(['src/scss/deck.scss', 'src/scss/spectre-theme.scss', 'src/scss/style.scss'])
    .pipe(sass())
    .pipe(gulp.dest('src/css'))
    .pipe(browserSync.stream());
});

// Move Js files to /src/js folder7
gulp.task('js', function () {
  return gulp.src(['node_modules/deck-of-cards/dist/deck.min.js', 'node_modules/pokersolver/pokersolver.js'])
    .pipe(gulp.dest('src/js'))
    .pipe(browserSync.stream());
});

// Static server + watching scss/html files
gulp.task('serve', ['sass'], function () {

  browserSync.init({
    server: './src'
  });

  gulp.watch(['src/scss/*.scss'], ['sass']);
  gulp.watch('src/*.html').on('change', browserSync.reload);
  gulp.watch('src/js/*.js').on('change', browserSync.reload);
})

gulp.task('default', ['js', 'serve']);