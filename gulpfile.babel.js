import gulp from "gulp";
import sass from "gulp-sass";
import browserSync from "browser-sync";
import csso from "gulp-csso";
import rename from "gulp-rename";
import postcss from "gulp-postcss";
import autoprefixer from "autoprefixer";
import { rollup } from "rollup";
import file from "gulp-file";

// const gulp = require("gulp");
// const browserSync = require("browser-sync").create();
// const sass = require("gulp-sass");
// const csso = require("gulp-csso");
// const rename = require("gulp-rename");
// const postcss = require("gulp-postcss");
// const autoprefixer = require("autoprefixer");
import babel from "rollup-plugin-babel";
import { uglify } from "rollup-plugin-uglify";

//const { version } = require("./package.json");
import { version } from "./package.json";

gulp.task("sass-build", () =>
  gulp
    .src("src/scss/kodhus.scss")
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
    .pipe(sass())
    .pipe(csso())
    .pipe(postcss([autoprefixer()]))
    .pipe(rename({ suffix: `.min` }))
    .pipe(gulp.dest("dist"))
    .pipe(gulp.dest("public"))
    .pipe(browserSync.stream())
);

gulp.task("html", () =>
  gulp
    .src("./src/*.html")
    .pipe(gulp.dest("./public"))
    .pipe(browserSync.reload({ stream: true }))
);

gulp.task("js", () => {
  return rollup({
    input: "src/js/kodhus.js",
    output: {
      name: "Kodhus",
      file: `public/kodhus-${version}.min.js`,
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
        format: "umd",
        moduleName: "myModuleName",
        output: {
          name: "kodhus",
        },
      });
    })
    .then((gen) => {
      return file(`kodhus.min.js`, gen.code, { src: true }).pipe(
        gulp.dest("public/")
      );
    });
});

gulp.task("sass-build-latest", () =>
  gulp
    .src("src/scss/kodhus.scss")
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
    .pipe(sass())
    .pipe(csso())
    .pipe(postcss([autoprefixer()]))
    .pipe(rename({ suffix: "-latest.min" }))
    .pipe(gulp.dest("dist"))
    .pipe(browserSync.stream())
);

gulp.task(
  "serve",
  gulp.series("sass", "html", "js", () => {
    browserSync.init({
      server: {
        baseDir: "./public",
      },
      notify: false,
    });
    gulp.watch("src/scss/*.scss", gulp.series("sass-build-min"));
    gulp.watch("src/*.html", gulp.series("html"));
    gulp.watch("public/*").on("change", browserSync.reload);
  })
);

gulp.task("default", gulp.series("serve"));
