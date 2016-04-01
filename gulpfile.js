const gulp = require('gulp');
var ts = require('gulp-typescript');

//TypeScript Transpile
gulp.task('default', function () {
	return gulp.src('./*.ts')
		.pipe(ts({
		 target: "es5",
		 noImplicitAny: true,
			sourceMap: true,
			pretty: true,
		}))
		.pipe(gulp.dest('build'));
});
