// Import `src` and `dest` from gulp for use in the task.
const { src, dest } = require('gulp');

// Import Gulp plugins.
const babel = require('gulp-babel');
const plumber = require('gulp-plumber');
const concat = require('gulp-concat');

exports.default = function(done) {
  return src('./src/**/*.js')
    // Stop the process if an error is thrown.
    .pipe(plumber())
    // Transpile the JS code using Babel's preset-env.
    .pipe(babel({
      presets: [
        ['@babel/env', {
          modules: false
        }]
      ]
    }))
    // Concatinate the files into one js file.
    .pipe(concat('index.js'))
    // Save the file in the dist folder.
    .pipe(dest('./dist/'))
};

