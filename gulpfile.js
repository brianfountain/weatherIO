var gulp = require('gulp'),
    browserify = require('gulp-browserify'),
    webserver = require('gulp-webserver');

var src = './src/',
    app = './dist/';

gulp.task('js', function() {
  return gulp.src( src + '/js/app.js' )
    .pipe(browserify({
      transform: 'reactify',
      debug: true
    }))
    .on('error', function (err) {
      console.error('Error!', err.message);
    })
    .pipe(gulp.dest(app + 'js/'));
	
	//return gulp.src('src/**/*.js')
      //  .pipe(sourcemaps.init())
      //  .pipe(babel({
      //      presets: ['es2015']
     //   }))
     //   .pipe(concat('all.js'))
     //   .pipe(sourcemaps.write('.'))
      //  .pipe(gulp.dest('dist'));*/
});

gulp.task('html', function() {
  gulp.src( src + '**.html')
    .pipe(gulp.dest(app));
});

gulp.task('css', function() {
  gulp.src( src + '/css/**.css')
    .pipe(gulp.dest(app + 'css/'));
});

gulp.task('copy', function () {
    gulp.src(src + '/js/**.js') 
       .pipe(gulp.dest(app + '/js/'))
    
    gulp.src(src + '/js/**.php') 
       .pipe(gulp.dest(app + '/js/'))
    
    gulp.src(src + '/media/images/**') 
       .pipe(gulp.dest(app + '/media/images/'))
});

gulp.task('watch', function() {
  gulp.watch( src + '/js/**.js', ['js']);
  gulp.watch( src + '/css/**.css', ['css']);
  gulp.watch([ src + '**.html'], ['html']);
});

gulp.task('webserver', function() {
  gulp.src( dist + '/')
    .pipe(webserver({
        livereload: true,
        open: true
    }));
});

gulp.task('default', ['watch', 'html', 'js', 'css', 'copy']);
