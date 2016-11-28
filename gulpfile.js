const gulp         = require('gulp');
const concat       = require('gulp-concat');
const plumber      = require('gulp-plumber');
const notify       = require('gulp-notify');
const uglify       = require("gulp-uglify");
const sourcemaps   = require('gulp-sourcemaps');
const babel        = require('gulp-babel');

const srcPath = './src/';

gulp.task('js',()=>{
	return gulp.src(['globalSettings.js',
					 'controller.js', 'router.js', 'view.js'].map(el=>srcPath + el))
		.pipe(plumber({
	    	errorHandler: notify.onError('JS error: <%= error.message %>')
	    }))
	    .pipe(sourcemaps.init())
		.pipe(babel({
            presets: ['es2015']
        }))
		.pipe(concat('core.js'))
		.pipe(uglify())
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('./'))
});