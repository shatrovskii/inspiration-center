var gulp = require("gulp"),
	yaml = require('gulp-yaml'),
	clean = require('gulp-clean'),
	jsoncombine = require("gulp-jsoncombine")

gulp.task('clean', function() {
  return gulp.src(['dist'], {read: false})
    .pipe(clean());
});

gulp.task('yaml', ['clean'], function() {
	return gulp.src('./src/**/*.yml')
		.pipe(yaml({
			safe: true,
			space: 2
		}))
		.pipe(jsoncombine('config.json', (data, meta) => {
			var result = {};
			for (key in data) {
				if (~key.indexOf('/')) {
					var collectionName = key.split('/')[0]
					var collection = result[collectionName] || (result[collectionName] = [])
					collection.push(data[key])
				} else {
					result[key] = data[key]
				}
			}
			return new Buffer(JSON.stringify(result));
		}))
		.pipe(gulp.dest('./dist'));
})

gulp.task('images', ['clean'], function() {
	return gulp.src(['./img/*'])
		.pipe(gulp.dest('./dist/img'))
})

gulp.task('build', ['yaml', 'images'])

gulp.task('watch', function() {
	gulp.watch(['./src/**/*', 'gulpfile.js'], ['build'])
})

gulp.task('default', ['build']);