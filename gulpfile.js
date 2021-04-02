'use-strict';

const gulp = require("gulp"),
	gulpIf = require("gulp-if"),
	sass = require("gulp-dart-sass"),
	sourcemaps = require('gulp-sourcemaps'),
	cleanCss = require("gulp-clean-css"),
	terser = require("gulp-terser");

// define file locations
const html = [".\\sprestquerybuilder.html"],
	scss = [".\\sprestquerybuilder.scss"],
	js = [".\\sprestquerybuilder.js"];

let dest = ".\\devdist";

let env;
// use the NodeJS process.env to look at the PCs local envir vars
// this will look for a system envir called NODE and if it does exist, it will read it's value, if not it will simply set the var value to "development"
env = process.env.NODE_ENV || "development";

// check to see if the envir of the local system is prod or dev
if (env === "production") {
	// set the Destinations to the Production locations
	dest = ".\\dist\\";
}

// create a task to process the html files
gulp.task("deployHtml", () => {
	return (
		gulp
			.src(html)
			.pipe(gulp.dest(dest))
	);
});

// create a task to process the sass files
gulp.task("deployScss",  () => {
	return (
		gulp
		.src(scss)
		// initialize source maps
		.pipe(sourcemaps.init())
		// error checking, logs out to console
		.pipe(sass().on("error", sass.logError))
		// if in the dev environment write source maps
		.pipe(gulpIf(env === "development", sourcemaps.write(".")))
		// check if production mode before minify
		.pipe(gulpIf(env === "production", cleanCss()))
		// and then passing the files into the dest via the .pipe method
		.pipe(gulp.dest(dest))
		);
});

// create a task to process the js files
gulp.task("deployJs", () => {
	return (
		gulp
		.src(js)
		// .pipe(sourcemaps.init())
		.pipe(gulpIf(env === "production", terser()))
		// .pipe(gulpIf(env === "development", sourcemaps.write(".")))
		.pipe(gulp.dest(dest))
	);
});

// define a default task
gulp.task("default", gulp.parallel("deployHtml","deployScss","deployJs"));