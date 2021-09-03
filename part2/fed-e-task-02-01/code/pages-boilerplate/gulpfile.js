// 实现这个项目的构建任务

const { src, dest, parallel } = require("gulp");
const swig = require("gulp-swig");
const sass = require("gulp-sass")(require("sass"));
const babel = require("gulp-babel");

const page = () => {
  return src("src/*.html", { base: "src" })
    .pipe(swig())
    .pipe(dest("dist"));
};

const style = () => {
  return src("src/assets/styles/*.scss", { base: "src" }) // base 保留文件路径
    .pipe(sass())
    .pipe(dest("dist"));
};

const script = () => {
  return src("src/assets/scripts/*.js", { base: "src" }) // base 保留文件路径
    .pipe(babel({ presets: ["@babel/preset-env"] }))
    .pipe(dest("dist"));
};

const complie = parallel(page, style, script)

module.exports = {
  complie
};
