var gulp = require("gulp"),
	yaml = require('gulp-yaml'),
	clean = require('gulp-clean'),
	jsoncombine = require("gulp-jsoncombine");

gulp.task('clean', function() {
  return gulp.src(['dist'], {read: false})
    .pipe(clean());
});

gulp.task('yaml', ['clean'], function() {
	return gulp.src('./src/categories/*.yml')
		.pipe(yaml({
			safe: true,
			space: 2
		}))
		.pipe(jsoncombine('categories.json', function(data) {
			var result = [];
			for (key in data) {
				result.push(data[key])
			}
			return new Buffer(JSON.stringify(result));
		}))
		.pipe(gulp.dest('./dist'));
})

gulp.task('default', ['yaml']);