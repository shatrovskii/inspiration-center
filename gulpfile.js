'use strict';

let gulp = require('gulp-param')(require("gulp"), process.argv),
	yaml = require('gulp-yaml'),
	clean = require('gulp-clean'),
	jsoncombine = require("gulp-jsoncombine"),
	VideoParser = require('./video-parser'),
	through = require('through2')

gulp.task('clean', function() {
  return gulp.src(['dist'], {read: false})
    .pipe(clean());
});

function parseVideo(parser, url) {
	return new Promise(resolve => {
		parser.parse((err, videoInfo) => {
			if (err) {
				resolve(null)
			} else {
				resolve(videoInfo)
			}
		}, url)
	})
}

function prepareVideos(videos) {
	return videos
		.filter(video => video)
		.map(result => ({
			url: result.url,
			name: result.name,
			thumbnailUrl: result.thumb_url,
		}))
}

function populateVideos(config, parser) {
	return new Promise(resolve => {
		// populate videos collection
		let parsePromises = config.videos.map(video => parseVideo(parser, video.url))

		let videosPromise = Promise.all(parsePromises)
			.then(results => {
				config.videos = prepareVideos(results)
			})

		// populate videos in categories
		let categoriesPromises = config.categories.map(category => {
			if (!category.videos) {
				return Promise.resolve(category)
			}

			let parsePromises = category.videos.map(videoUrl => parseVideo(parser, videoUrl))

			return Promise.all(parsePromises)
				.then(results => {
					category.videos = prepareVideos(results)
					return category
				})
		})

		let categoriesPromise = Promise.all(categoriesPromises)
			.then(results => {
				console.log('categories')
				console.dir(results)
				config.categories = results
			})

		Promise.all(videosPromise, categoriesPromise)
			.then(() => {
				console.log(config)
				resolve(config)
			})
	})
}

gulp.task('compile', ['clean'], function(youtube, vimeo) {
	let videoParser = new VideoParser({
	    youtube: {
	        key: youtube
	    },
	    vimeo: {
	        access_token: vimeo
	    },
	    disableCache: true
	})

	return gulp.src('./src/**/*.yml')
		// compile YAML to JSON
		.pipe(yaml({
			safe: true,
			space: 2
		}))
		// concat JSON files in to one
		.pipe(jsoncombine('config.json', (data, meta) => {
			let result = {};
			for (let key in data) {
				if (~key.indexOf('/')) {
					let collectionName = key.split('/')[0]
					let collection = result[collectionName] || (result[collectionName] = [])
					collection.push(data[key])
				} else {
					result[key] = data[key]
				}
			}
			return new Buffer(JSON.stringify(result));
		}))
		// get video metadata
		.pipe(through.obj((file, enc, cb) => {
			populateVideos(JSON.parse(file.contents.toString()), videoParser)
				.then((result) => {
					file.contents = new Buffer(JSON.stringify(result))
					cb(null, file)
				})
		}))
		.pipe(gulp.dest('./dist'));
})

gulp.task('images', ['clean'], function() {
	return gulp.src(['./img/*'])
		.pipe(gulp.dest('./dist/img'))
})

gulp.task('build', ['compile', 'images'])

gulp.task('watch', function() {
	gulp.watch(['./src/**/*', 'gulpfile.js'], ['build'])
})

gulp.task('default', ['build']);