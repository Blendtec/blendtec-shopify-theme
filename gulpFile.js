var gulp = require('gulp'),
	htmlLint = require('gulp-html-lint');

var htmlOptions = {
	htmllintrc: '.htmllintrc',
	useHtmllintrc: true,
	plugins: []
};

gulp.task('linthtml', function() {
	// return gulp.src('TODO')
	// 	.pipe(htmlLint(htmlOptions))
	// 	.pipe(htmlLint.format())
	// 	.pipe(htmlLint.failOnError());
});