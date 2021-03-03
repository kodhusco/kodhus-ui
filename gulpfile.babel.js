import gulp from "gulp";
import sass from "gulp-sass";
import browserSync from "browser-sync";
import csso from "gulp-csso";
import rename from "gulp-rename";
import postcss from "gulp-postcss";
import autoprefixer from "autoprefixer";
import { rollup } from "rollup";
import file from "gulp-file";
import concat from "gulp-concat";
import babel from "gulp-babel";
var sassGlob = require('gulp-sass-glob');

import { version } from "./package.json";

gulp.task("sass-build", () =>
    gulp
    .src("src/scss/kodhus.scss")
    .pipe(sassGlob())
    .pipe(sass())
    .pipe(postcss([autoprefixer()]))
    .pipe(rename({ suffix: `-${version}` }))
    .pipe(gulp.dest("dist"))
    .pipe(gulp.dest("public"))
    .pipe(browserSync.stream())
);

gulp.task("sass-build-min", () =>
    gulp
    .src("src/scss/kodhus.scss")
    .pipe(sassGlob())
    .pipe(sass())
    .pipe(csso())
    .pipe(postcss([autoprefixer()]))
    .pipe(rename({ suffix: `-${version}.min` }))
    .pipe(gulp.dest("dist"))
    .pipe(gulp.dest("public"))
    .pipe(browserSync.stream())
);

gulp.task("sass", () =>
    gulp
    .src("src/scss/kodhus.scss")
    .pipe(sassGlob())
    .pipe(sass())
    .pipe(csso())
    .pipe(postcss([autoprefixer()]))
    .pipe(rename({ suffix: `.min` }))
    .pipe(gulp.dest("dist"))
    .pipe(gulp.dest("public/assets/css"))
    .pipe(browserSync.stream())
);

gulp.task("js", () =>
    gulp
    .src("src/js/components/*.js")
    .pipe(
        babel({
            presets: ["@babel/preset-env"],
        })
    )
    .pipe(concat("app.js"))
    .pipe(gulp.dest("public/assets/js"))
    .pipe(browserSync.reload({
        stream: true
    }))
);

gulp.task("html", () =>
    gulp
    .src("./src/*.html")
    .pipe(gulp.dest("./public"))
    .pipe(browserSync.reload({ stream: true }))
);

gulp.task("fonts", () =>
    gulp
    .src("./src/fonts/*")
    .pipe(gulp.dest("./public/assets/fonts"))
    .pipe(browserSync.reload({ stream: true }))
);

gulp.task("kodhus-js", () => {
    return rollup({
            input: "src/js/kodhus.js",
            output: {
                name: "Kodhus",
                file: `public/assets/js/kodhus-${version}.min.js`,
                format: "iife",
                banner: `/*!
        * Kodhus v${version}
        * Copyright 2018 Kodhus (https://kodhus.com)
        * Licensed under MIT (https://github.com/Kodhuset/kodhus-ui/blob/master/LICENSE.md)
        */`,
            },
            plugins: [
                babel({
                    presets: [
                        [
                            "es2015",
                            {
                                modules: false,
                            },
                        ],
                    ],
                    plugins: ["external-helpers"],
                    babelrc: false,
                    exclude: "node_modules/**",
                }),
            ],
        })
        .then((bundle) => {
            return bundle.generate({
                format: "iife",
                moduleName: "myModuleName",
                output: {
                    name: "Kodhus",
                },
            });
        })
        .then((gen) => {
            return file(`assets/js/kodhus.min.js`, gen.code, { src: true }).pipe(
                gulp.dest("public/")
            );
        });
});

gulp.task("sass-build-latest", () =>
    gulp
    .src("src/scss/kodhus.scss")
    .pipe(sassGlob())
    .pipe(sass())
    .pipe(csso())
    .pipe(postcss([autoprefixer()]))
    .pipe(rename({ suffix: "-latest" }))
    .pipe(gulp.dest("dist"))
    .pipe(browserSync.stream())
);

gulp.task("sass-build-min-latest", () =>
    gulp
    .src("src/scss/kodhus.scss")
    .pipe(sassGlob())
    .pipe(sass())
    .pipe(csso())
    .pipe(postcss([autoprefixer()]))
    .pipe(rename({ suffix: "-latest.min" }))
    .pipe(gulp.dest("dist"))
    .pipe(browserSync.stream())
);

gulp.task(
    "serve",
    gulp.series("sass", "html", "kodhus-js", "js", "fonts", () => {
        browserSync.init({
            server: {
                baseDir: "./public",
                middleware: function(req, res, next) {
                    res.setHeader("Access-Control-Allow-Origin", "*");
                    next();
                },
            },
            notify: false,
        });
        gulp.watch("src/scss/**/*.scss", gulp.series("sass"));
        gulp.watch("src/js/kodhus.js", gulp.series("kodhus-js"));
        gulp.watch("src/js/components/*.js", gulp.series("js"));
        gulp.watch("src/*.html", gulp.series("html"));
        gulp.watch("public/*").on("change", browserSync.reload);
    })
);

gulp.task("default", gulp.series("serve"));