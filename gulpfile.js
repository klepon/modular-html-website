// source files
let src = {
	stylesLib			: ['_src/assets/styles/lib/*.scss', '_src/assets/styles/lib/*.less', '_src/assets/styles/lib/*.css'],
	styles				: ['_src/assets/styles/*.scss',
										'_src/modules/**/*.scss',
										'_src/modules/**',
										'_src/modules/',
										'!**/*.js',
										'!**/*jsx',
										'!**/*.hbs'],
	scriptsLib		: ['_src/assets/scripts/lib/*.js'],
	scripts				: ['_src/assets/scripts/*.js',
										'_src/modules/**/*.js',
										'_src/modules/*/*.jsx',
										'_src/modules/**',
										'_src/modules/',
										'!**/*.scss',
										'!**/*.hbs'],
	images				: '_src/assets/images/**',
	allHtmls			: ['_src/pages/*.hbs'
										, '_src/modules/**/*.hbs', '_src/modules/**', '_src/modules/'
										, '_src/master/**/*.hbs', '_src/master/**', '_src/master/'
										, '_src/section/**/*.hbs', '_src/section/**', '_src/section/'
										, '!**/*.scss', '!**/*.js', '!**/*jsx'],
	pages					: '_src/pages/*.hbs',
	fonts					: '_src/fonts/**',
	htmlsCheck		: 'dist/*.html',
	master				: '_src/master/',
	modules				: ['_src/master/', '_src/modules/', '_src/section/'],
	svgIcons			:	'_src/svg/*.svg',
	svgSprite			:	'_src/svg/dist/',
	svgIconImage	:	'_src/assets/images/'
},

dist = {
	styles	: 'dist/assets/styles/',
	scripts	: 'dist/assets/scripts/',
	images	: 'dist/assets/images/',
	fonts		: 'dist/fonts/',
	htmls 	: 'dist/',
},

fileName = {
	styleLib	: 'style.min.lib.css',
	style			: 'style.min.css',
	scriptLib	: 'script.lib.js',
	script		: 'script.min.js'
}

// include required plugin
const	clean = require('gulp-clean'),
	gulp = require('gulp'),
	sass = require('gulp-sass'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	notify = require('gulp-notify'),
	cssnano = require('gulp-cssnano'),
	jshint = require('gulp-jshint'),
	htmlmin = require('gulp-htmlmin'),
	access = require('gulp-accessibility'),
	rename = require('gulp-rename'),
	htmlv = require('gulp-html-validator'),
	connect = require('gulp-connect'),
	babel = require('gulp-babel'),
	copy = require('gulp-copy'),
	cmq = require('gulp-combine-mq'),
	handlebars = require('handlebars'),
	svgmin = require('gulp-svgmin'),
	svgSymbols = require('gulp-svg-symbols'),
	gulpHandlebars = require('gulp-handlebars-html')(handlebars);

gulp.task('default', ['del-dist', 'sprites'], function(){
	return gulp.start('compile');
});

gulp.task('compile', ['stylesLib', 'styles', 'scriptsLib', 'scripts', 'handlebars', 'copy-fonts', 'copy-images'], function(){
	return gulp.start('validate');
});

gulp.task('validate', ['test-accessibility', 'html-validator'], function(){
	return gulp.start('serve-and-watch');
});

gulp.task('serve-and-watch', ['server'], function(){
	gulp.watch(src.stylesLib, function() {
			gulp.start('stylesLib');
	});

	gulp.watch(src.styles, function() {
			gulp.start('styles');
	});

	gulp.watch(src.scriptsLib, function() {
			gulp.start('scriptsLib');
	});

	gulp.watch(src.scripts, function() {
			gulp.start('scripts');
	});

	gulp.watch(src.allHtmls, function() {
			gulp.start('handlebars');
	});

	gulp.watch(src.fonts, function() {
			gulp.start('copy-fonts');
	});

	gulp.watch(src.images, function() {
			gulp.start('copy-images');
	});

	gulp.watch(src.svgIcons, function() {
			gulp.start('sprites');
	});

	gulp.watch([src.htmlsCheck, dist.styles], function() {
			gulp.start('test-accessibility');
	});

	gulp.watch(src.htmlCheck, function() {
			gulp.start('html-validator');
	});
});

// remove dist
gulp.task('del-dist', function(){
	return gulp.src(dist.htmls, {read: false})
		.pipe(clean());
		// .pipe(notify("Remove dist folder"));
});

// build svg sprite
gulp.task('sprites', function () {
	return gulp.src(src.svgIcons)
		.pipe(svgmin())
		.pipe(svgSymbols({
			svgClassname: 'svg-icon-lib',
			templates: ['default-svg']
		}))
		.pipe(rename({extname: '.hbs'}))
		.pipe(gulp.dest(src.master));
		// .pipe(notify("svg sprite created"));
});

// compile lib styles, ignore any error
gulp.task('stylesLib', function(){
	return gulp.src(src.stylesLib)
		.pipe(sass({outputStyle: 'compressed'})
		.on('error', function() {}))
		.pipe(cssnano({
			safe: true,
			autoprefixer: false,
		  discardComments: {removeAll: true}
		}))
		.pipe(concat(fileName.styleLib))
		.pipe(gulp.dest(dist.styles))
		.pipe(connect.reload());
		// .pipe(notify("Styles Lib compiled"));
});

// compile styles
gulp.task('styles', function(){
	let handleError = function (error) {
		notify().write("ERROR: Compile styles\n");
		console.log(error.message);
		this.emit('end');
	},

	supported = [
    'last 2 versions',
    'safari >= 8',
    'ie >= 10',
    'ff >= 20',
    'ios 6',
    'android 4'
	];

	return gulp.src(src.styles)
    .pipe(sass({outputStyle: 'compressed'})
		.on('error', sass.logError))
    .on('error', handleError)
		.pipe(cmq())
    .pipe(cssnano({
			// sourcemap: true,
    	safe: true,
    	autoprefixer: {browsers: supported, add: true},
      discardComments: {removeAll: true}
    }))
    .pipe(concat(fileName.style))
    .pipe(gulp.dest(dist.styles))
		.pipe(connect.reload())
    .pipe(notify("Styles compiled"));
});

// compile scriptsLib
gulp.task('scriptsLib', function(){
    return gulp.src(src.scriptsLib)
      .pipe(uglify())
      .pipe(concat(fileName.scriptLib))
      .pipe(gulp.dest(dist.scripts))
			.pipe(connect.reload());
      // .pipe(notify("Scripts library compiled"));
});

// compile scripts
gulp.task('scripts', function(){
    let handleError = function (error) {
        notify().write("ERROR: Compile scripts");
        this.emit('end');
    };

    return gulp.src(src.scripts)
			.pipe(babel({
					presets: ['es2015']
			}))
      .pipe(uglify())
      .pipe(concat(fileName.script))
      .pipe(gulp.dest(dist.scripts))
			.pipe(connect.reload())
      .pipe(notify("Scripts compiled"));
});

// include handlebars
gulp.task('handlebars', function() {
	const templateData = {
			dev: true
		},
		options = {
			partialsDirectory : src.modules
		}

	return gulp.src(src.pages)
	.pipe(gulpHandlebars(templateData, options))
	.pipe(rename({extname: '.html'}))
	.pipe(gulp.dest(dist.htmls))
	.pipe(connect.reload())
	.pipe(notify("Html compiled"));
});

// copy fonts
gulp.task('copy-fonts', function(){
	return gulp.src(src.fonts)
	  .pipe(copy(dist.fonts, {prefix: 2}))
		.pipe(connect.reload());
		// .pipe(notify("Fonts copied"));
});

// copy images
gulp.task('copy-images', function(){
	return gulp.src(src.images)
	  .pipe(copy(dist.images, {prefix: 3}))
		.pipe(connect.reload());
		// .pipe(notify("Images copied"));
});

// check accessibility
gulp.task('test-accessibility', function() {
	let option = { // https://github.com/yargalot/AccessSniff
		force: true,
		accessibilityLevel: 'WCAG2AA', //WCAG2A, WCAG2AA, and WCAG2AAA
		reportLevels: {
		notice: false,
		warning: false,
		error: true
		}
	};

	return gulp.src(src.htmlsCheck)
		.pipe(access(option))
		.on('error', console.log)
		.pipe(access.report({reportType: 'txt'}))
		.pipe(rename({extname: '.txt'}))
		.pipe(gulp.dest('_reports/WCAG2'));
		// .pipe(notify("Accessibility checked"));
});

// w3c validator
gulp.task('html-validator', function () {
  return gulp.src(src.htmlsCheck)
    .pipe(htmlv())
    .pipe(gulp.dest('_reports/W3C'));
    // .pipe(notify("Html checked"));
});

// run local server
gulp.task("server", function(){
  connect.server({
    root : "./dist",
    livereload : true,
    port : 9001
  });
});
