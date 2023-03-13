const gulp = require("gulp");
const clean = require("gulp-clean");
const zip = require("gulp-zip");
const less = require('gulp-less');
const webp = require('gulp-webp');
var merge = require('gulp-merge-json');

const cb = require("cb");
const fs = require("fs");
const through2 = require("through2");
const Datastore = require("nedb");
const path = require("path");
const mergeStream = require('merge-stream');

/********************/
/*  CONFIGURATION   */
/********************/
const projectDirectory = '.';
const stylesExtension = 'less';
const stylesDirectory = `${projectDirectory}/styles`;
const sourceDirectory = `${projectDirectory}/src`;
const sourcePacks = `${sourceDirectory}/packs`;
const sourceTemplate = `${sourceDirectory}/template`;
const sourceLangs = `${sourceDirectory}/lang`;
const distPacks = `${projectDirectory}/packs`;
const assetsDirectory = `${projectDirectory}/assets`;
const sourceStyles = `${sourceDirectory}/${stylesExtension}`;
const systemVTT = JSON.parse(fs.readFileSync(`${projectDirectory}/system.json`));

const buildDirs = [
  `${stylesDirectory}/**/*`,
  `${distPacks}/**/*`,
  `${assetsDirectory}/**/*`,
  `${projectDirectory}/lang/**/*`,
  `${projectDirectory}/templates/**/*`,
  `${projectDirectory}/module/**/*`,
  `${projectDirectory}/system.json`,
  `${projectDirectory}/template.json`
];

/*************************/
/*  Compile Compendium   */
/*************************/
function compilePacks() {

  // determine the source folders to process
  const folders = fs.readdirSync(sourcePacks).filter((file) => {
    return fs.statSync(path.join(sourcePacks, file)).isDirectory();
  });

  // process each folder into a compendium db
  const packs = folders.map((folder) => {

    const db = new Datastore({
      filename: `${distPacks}/${folder}.db`, 
      autoload: true
    });
    
    return gulp.src(`${sourcePacks}/${folder}/*.json`).pipe(
      through2.obj((file, enc, cb) => {
        const json = JSON.parse(file.contents.toString());

        json.forEach((value) => {
          db.insert(value);
        });

        cb(null, file);
      })
    );
  });

  return mergeStream.call(null, packs);
};

/**************************/
/*  Create zip build      */
/**************************/
function createZip() {
  
  return gulp
    .src(buildDirs, {base: './'})
    .pipe(zip(`${systemVTT.id}.zip`))
    .pipe(gulp.dest(`${projectDirectory}/`));
};

/**************************/
/*  Compile Less to CSS   */
/**************************/
function compileLess(cb) {
  gulp
    .src(`${sourceStyles}/index.${stylesExtension}`)
    .pipe(less())
    .pipe(gulp.dest(stylesDirectory));
  cb();
};

/**************************/
/*  Convert images        */
/**************************/
function compileImages() {
  return gulp.src(`${assetsDirectory}/**/*.{png,jpeg,jpg}`, {base: './'})
    .pipe(webp())
    .pipe(gulp.dest(`${projectDirectory}/`));
};

/**************************/
/*  Clean Packs           */
/**************************/
function cleanPacks() {
  // removing old compendiums
  // if not deleted, it will add to the current
  return gulp.src(`${distPacks}`, { allowEmpty: true }, { read: false }).pipe(clean());
}

/**************************/
/*  Compile lang/ru.json */
/*  if very big file      */
/**************************/
function compileLangs() {
  return gulp.src(`${sourceLangs}/*.json`)
	.pipe(merge({
    fileName: "lang/ru.json",
    jsonSpace: "  "
  }))
	.pipe(gulp.dest(`${projectDirectory}/`));
}

/**************************/
/*  Compile template.json */
/*  if very big file      */
/**************************/
function compileTemplate() {
  return gulp.src(`${sourceTemplate}/*.json`)
	.pipe(merge({
    fileName: "template.json",
    jsonSpace: "  "
  }))
	.pipe(gulp.dest(`${projectDirectory}/`));
}

/**************************/
/*  Watches dirs          */
/**************************/
gulp.task('watch', function(){
  gulp.watch(`${sourceStyles}/**/*.${stylesExtension}`, gulp.series(compileLess));
  gulp.watch(`${sourceTemplate}/*.json`, gulp.series(compileTemplate));
  gulp.watch(`${sourceLangs}/*.json`, gulp.series(compileLangs));
});

/********************/
/*  Export TasksS   */
/********************/
exports.compileLess = gulp.series(
  compileLess
);
exports.compilePacks = gulp.series(
  cleanPacks, 
  compilePacks
);
exports.zip = gulp.series(
  createZip
);
exports.compileTemplate = gulp.series(
  compileTemplate
);
exports.compileLangs = gulp.series(
  compileLangs
);
exports.build = gulp.series(
  cleanPacks, 
  compilePacks, 
  compileLess,
  compileLangs,
  compileTemplate, 
  createZip
);
exports.webp = gulp.series(
  compileImages
);