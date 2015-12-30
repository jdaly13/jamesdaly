var gulp = require('gulp');

var sass = require('gulp-sass');
var browserSync = require('browser-sync');



gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: 'app'
    },
  })
});


gulp.task('sassy', function() {
  return gulp.src('app/scss/**/*.scss') // Gets all files ending with .scss in app/scss
    .pipe(sass())
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});


gulp.task('watch', ['browserSync', 'sassy'], function (){
  gulp.watch('app/scss/**/*.scss', ['sassy']); 
  gulp.watch('app/*.html', browserSync.reload); 
  gulp.watch('app/js/**/*.js', browserSync.reload); 
});


