const TARGET_FILE_NAME = 'libs.min.js';
const TARGET_FOLDER_PATH = 'build';

const SOURCE_FILE_PATH = 'src/index.js';

let gulp = require('gulp'),
    webpack = require('webpack-stream');

gulp.task('default', function() {
    return gulp.src( SOURCE_FILE_PATH )
        .pipe(webpack({
            mode: 'production',
            output: {
                filename: TARGET_FILE_NAME,
            },
        }))
        .pipe(gulp.dest( TARGET_FOLDER_PATH ));
});