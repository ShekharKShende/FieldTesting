/**
 * Created by nikhila on 05/12/15.
 */
var gulp = require('gulp');
var livereload = require('gulp-livereload');
var nodemon = require('gulp-nodemon');
var gwebpack = require('gulp-webpack');
var rimraf = require('rimraf');
var concatCss = require('gulp-concat-css');
var srcPath = "src";
var modulesPath = "node_modules";
var distPath = "dist";
var serverMain = "server.js";
var path = require('path');

var webpack = function(watch) {
    var options;
    options = {
        watch: watch,
        cache: true,
        devtool: "source-map",
        output: {
            filename: "app.js",
            sourceMapFilename: "[file].map"
        },
        resolve: {
            extensions: ["", ".webpack.js", ".js"],
            modulesDirectories: [modulesPath]
        },
        module: {
            loaders: [
                {
                    test: [/\.js$/, /\.jsx$/],
                    include: [
                        path.resolve(__dirname, 'reducer'),
                        path.resolve(__dirname, 'src'),
                        path.resolve(__dirname, 'store'),
                        path.resolve(__dirname, modulesPath, 'common'),
                    ],
                    loader: "babel-loader",
                    query: {
                        presets: ['react', 'es2015']
                    }
                },
                { test: /bootstrap\/js\//, loader: 'imports?jQuery=jquery' },
                { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,   loader: "url?limit=10000&minetype=application/font-woff" },
                { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,    loader: "url?limit=10000&minetype=application/octet-stream" },
                { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,    loader: "file" },
                { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,    loader: "url?limit=10000&minetype=image/svg+xml" }
            ]
        }
    };
    return gulp.src(srcPath + "/app.js").pipe(gwebpack(options)).pipe(gulp.dest(distPath));
};

gulp.task('jsbundle', function() {
    return webpack(false);
});

gulp.task('jswatch', function() {
    return webpack(true);
});

gulp.task('style', function() {
    return gulp.src(srcPath + "/css/*.css")
        .pipe(concatCss('styles.css'))
        .pipe(gulp.dest(distPath));
});

gulp.task('clear', function() {
    return rimraf.sync(distPath);
});

gulp.task('copy', function() {
    gulp.src(srcPath + "/img/**/*.*").pipe(gulp.dest(distPath + "/img"));
    gulp.src(srcPath + "/img/*.*").pipe(gulp.dest(distPath + "/img"));
    gulp.src(srcPath + "/css/fonts/*.*").pipe(gulp.dest(distPath + "/fonts"));
    return gulp.src(srcPath + "/*.html").pipe(gulp.dest(distPath));
});

gulp.task('server', function() {
    return nodemon({
        script: serverMain,
        watch: [serverMain],
        execMap: {
            "js": "node --harmony"
        },
        env: {
            PORT: process.env.PORT || 3001
        }
    });
});

gulp.task('refresh', ['copy'], function() {
    livereload.listen();
    gulp.watch([distPath + "/**/*"]).on('change', livereload.changed);
    gulp.watch((srcPath + "/css/*.css"), ['style']);
    return gulp.watch([srcPath + "/**/*.html"], ['copy']);
});

gulp.task('build', ['clear', 'copy', 'style', 'jsbundle']);

gulp.task('default', ['clear', 'copy', 'style', 'server', 'jswatch', 'refresh']);
