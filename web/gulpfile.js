var gulp = require('gulp')
  , imagemin = require('gulp-imagemin')
  , sass = require('gulp-sass')
  , notify = require('gulp-notify')
  , watch = require('gulp-watch')
  , plumber = require('gulp-plumber')
  , concat = require('gulp-concat')
  , livereload = require('gulp-livereload')
  , lr = require('tiny-lr')
  , server = lr();

gulp.task('image', function() {
  return gulp.src('./public/images/src/**/*')
             .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
             .pipe(gulp.dest('./public/images/bin'))
             .pipe(notify({ message: 'Image task complete' }));
});

gulp.task('compile', function() {
  gulp.src(['./public/js/lib/jquery.js', './public/js/lib/underscore.js',
            './public/js/src/home/searchbar.js', './public/js/src/home/albums.js',
            './public/js/src/home/home.js'])
      .pipe(concat('home.js'))
      .pipe(gulp.dest('./public/js/bin'));

  gulp.src('./public/css/src/**')
      .pipe(sass())
      .pipe(gulp.dest('./public/css/bin'));
});

gulp.task('watch', function() {
  // LiveReload Server
  server.listen(35729, function (err) {
    if (err) {
      return console.log(err)
    };

    gulp.src('./public/js/src/**/*.js', { read : false })
        .pipe(watch({ emit: 'all'}, function(files){

          // Compile Homepage Page
          gulp.src(['./public/js/lib/jquery.js', './public/js/lib/underscore.js',
                    './public/js/src/home/searchbar.js', './public/js/src/home/albums.js',
                    './public/js/src/home/home.js'])
              .pipe(concat('home.js'))
              .pipe(gulp.dest('./public/js/bin'))
              .pipe(livereload(server));

        }));

    gulp.src('./public/css/src/**', { read : false })
        .pipe(watch())
        .pipe(plumber())
        .pipe(sass())
        .pipe(gulp.dest('./public/css/bin'))
        .pipe(livereload(server));

    gulp.src('./views/**/*.hbs', { read : false })
        .pipe(watch())
        .pipe(plumber())
        .pipe(livereload(server));

  });
});

