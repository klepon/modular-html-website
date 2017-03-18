// set true for production
let production = true,

// source files
src = {
	stylesLib						:	['_src/assets/styles/lib/*.scss',
													'_src/assets/styles/lib/*.less',
													'_src/assets/styles/lib/*.css'
												],
	styles							:	['_src/assets/styles/*.scss',
													'_src/modules/**/*.scss',
												],
	scriptsLibFolder		:	'_src/assets/scripts/lib/',
	scriptsLib					:	['_src/assets/scripts/lib/*.js'],
	scripts							:	['_src/assets/scripts/*.js',
													'_src/modules/**/*.js',
												],
	scriptsJsx					:	['_src/modules/**/*.jsx'],
	images							:	'_src/assets/images/**',
	allHtmls						:	['_src/pages/*.hbs',
													'_src/modules/**/*.hbs',
													'_src/master/**/*.hbs',
													'_src/section/**/*.hbs',
												],
	pages								:	'_src/pages/*.hbs',
	fonts								:	'_src/fonts/**',
	htmlsCheck					:	'dist/*.html',
	master							:	'_src/master/',
	modules							:	['_src/master/', '_src/modules/', '_src/section/'],
	svgIcons						:	'_src/svg/*.svg',
	svgSprite						:	'_src/svg/dist/',
	svgIconImage				:	'_src/assets/images/'
},

// dist files
dist = {
	styles	: 'dist/assets/styles/',
	scripts	: 'dist/assets/scripts/',
	images	: 'dist/assets/images/',
	fonts		: 'dist/assets/fonts/',
	htmls 	: 'dist/',
},

// files name
fileName = {
	styleLib	: 'style.min.lib.css',
	style			: 'style.min.css',
	scriptLib	: 'script.lib.js',
	script		: 'script.min.js',
	reactJs		: 'react-app.js',
	react			: '01.react.js',
	reactDom	: '02.react-dom.js'
},

// watch list
watch = [dist.scripts +'*.js', dist.images +'**.**', dist.fonts +'**.**'];

// include required plugin
const	clean = require('gulp-clean'),
	gulp = require('gulp'),
	gulpWatch = require('gulp-watch'),
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
	babel = require('gulp-babel'),
	copy = require('gulp-copy'),
	cmq = require('gulp-combine-mq'),
	handlebars = require('handlebars'),
	svgmin = require('gulp-svgmin'),
	svgSymbols = require('gulp-svg-symbols'),
	gulpHandlebars = require('gulp-handlebars-html')(handlebars),
	browserSync = require('browser-sync'),
	sourcemaps = require('gulp-sourcemaps'),
	download = require("gulp-download"),
	reload = browserSync.reload;

// default, use this after use clean
gulp.task('default', ['del-dist', 'sprites'], function(){
	return gulp.start('compile');
});

// re-download source, use this to develop after build
gulp.task('clean', ['del-react-source', 'del-dist', 'sprites'], function(){
	return gulp.start('compile');
});

// re-download production source
gulp.task('build', ['del-react-source', 'del-dist', 'sprites'], function(){
	production = true;

	return gulp.start('compile');
});

gulp.task('compile', ['stylesLib', 'styles', 'scriptsLib', 'scripts', 'scriptsJsx', 'handlebars', 'copy-fonts', 'copy-images'], function(){
	return gulp.start('validate');
});

gulp.task('validate', ['test-accessibility', 'html-validator'], function(){
	return gulp.start('serve-and-watch');
});

gulp.task('serve-and-watch', ['server'], function(){
	gulpWatch(src.stylesLib, function() {
			gulp.start('stylesLib');
	});

	gulpWatch(src.styles, function() {
			gulp.start('styles');
	});

	gulpWatch(src.scriptsLib, function() {
			gulp.start('scriptsLib');
	});

	gulpWatch(src.scripts, function() {
			gulp.start('scripts');
	});

	gulpWatch(src.scriptsJsx, function() {
			gulp.start('scriptsJsx');
	});

	gulpWatch(src.allHtmls, function() {
			gulp.start('handlebars');
	});

	gulpWatch(src.fonts, function() {
			gulp.start('copy-fonts');
	});

	gulpWatch(src.images, function() {
			gulp.start('copy-images');
	});

	gulpWatch(src.svgIcons, function() {
			gulp.start('sprites');
	});

	// gulpWatch([src.htmlsCheck, dist.styles], function() {
	// 		gulp.start('test-accessibility');
	// });

	// gulpWatch(src.htmlCheck, function() {
	// 		gulp.start('html-validator');
	// });

	gulpWatch(watch).on("change", reload);
});

// remove dist
gulp.task('del-dist', function(){
	return gulp.src([dist.htmls], {read: false})
		.pipe(clean());
		// .pipe(notify("Remove dist folder"));
});

// remove react source
gulp.task('del-react-source', function(){
	return gulp.src([src.scriptsLibFolder + fileName.react, src.scriptsLibFolder + fileName.reactDom], {read: false})
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
		.pipe(reload({ stream:true }));
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
		.pipe(reload({ stream:true }))
    .pipe(notify("Styles compiled"));
});

// compile scriptsLib
gulp.task('scriptsLib', ['copy-jquery', 'copy-react', 'copy-react-dom'], function(){
  return gulp.src(src.scriptsLib)
    .pipe(uglify())
    .pipe(concat(fileName.scriptLib))
    .pipe(gulp.dest(dist.scripts))
    // .pipe(notify("Scripts library compiled"))
		;
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
    .pipe(notify("Scripts compiled"));
});

// compile react jsx
gulp.task('scriptsJsx', function() {
    var handleJsHintError = function (error) {
        notify().write("ERROR: Compile scripts");
        this.emit('end');
    };

    return gulp.src(src.scriptsJsx)
			// .pipe(sourcemaps.init())
			.pipe(babel({
					presets: ['es2015', 'react', 'stage-0']
      }))
			.pipe(uglify())
      .pipe(concat(fileName.reactJs))
			// .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(dist.scripts))
      .pipe(notify("Scripts Jsx compiled"));
});

// include handlebars
gulp.task('handlebars', ['compile-hbs'], function() {
	reload();
});

gulp.task('compile-hbs', function() {
	const templateData = {
			dev: false
		},
		options = {
			partialsDirectory : src.modules
		}

	return gulp.src(src.pages)
	.pipe(gulpHandlebars(templateData, options))
	.pipe(rename({extname: '.html'}))
	.pipe(gulp.dest(dist.htmls))
	.pipe(notify("Html compiled"));
});

// copy react from cdn
gulp.task('copy-react', function() {
	let fs = require('fs'),
      file = src.scriptsLibFolder + fileName.react,
			source = production ? 'https://unpkg.com/react/dist/react.min.js' : 'https://unpkg.com/react/dist/react.js';

  if (!fs.existsSync(file) || production) {
		return download(source)
			.pipe(concat( fileName.react ))
			.pipe(gulp.dest(src.scriptsLibFolder))
			.pipe(notify("React copied"));
  }
});

// copy react-dom from cdn
gulp.task('copy-react-dom', function() {
	let fs = require('fs'),
      file = src.scriptsLibFolder + fileName.reactDom,
			source = production ? 'https://unpkg.com/react-dom/dist/react-dom.min.js' : 'https://unpkg.com/react-dom/dist/react-dom.js';

	if (!fs.existsSync(file) || production) {
		return download(source)
			.pipe(concat( fileName.reactDom ))
	    .pipe(gulp.dest(src.scriptsLibFolder))
			.pipe(notify("React DOM copied"));
	}
});

// copy jquery from npm modules
gulp.task('copy-jquery', function() {
	let fs = require('fs'),
      file = src.scriptsLibFolder +'jquery.js';

	if (!fs.existsSync(file)) {
		return download('https://code.jquery.com/jquery-3.1.1.js')
			.pipe(concat('jquery.js'))
		  .pipe(gulp.dest(src.scriptsLibFolder))
			.pipe(notify("Jquery copied"));
	}
});

// copy fonts
gulp.task('copy-fonts', function(){
	return gulp.src(src.fonts)
	  .pipe(copy(dist.fonts, {prefix: 2}));
		// .pipe(notify("Fonts copied"));
});

// copy images
gulp.task('copy-images', function(){
	return gulp.src(src.images)
	  .pipe(copy(dist.images, {prefix: 3}));
		// .pipe(notify("Images copied"));
});

// check accessibility
gulp.task('test-accessibility', function() {
	return;

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
	return;

  return gulp.src(src.htmlsCheck)
    .pipe(htmlv())
    .pipe(gulp.dest('_reports/W3C'));
    // .pipe(notify("Html checked"));
});

// run local server
gulp.task("server", function(){
  browserSync({
    server: {
      baseDir: './dist'
    }
  });
});
