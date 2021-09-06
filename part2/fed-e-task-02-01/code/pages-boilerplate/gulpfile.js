// 实现这个项目的构建任务

const { src, dest, series, parallel } = require("gulp");

const del = require("del");

// 自动 require 所有的 gulp 插件
const plugins = require('gulp-load-plugins')();
const sass = plugins.sass(require('sass')); // sass 的引入方法需要特殊处理下

/**
 * @desc: HTML 编译
 */
const page = () => {
  return src("src/*.html", { base: "src" }).pipe(plugins.swig()).pipe(dest("dist"));
};

/**
 * @desc: Sass 编译
 */
const style = () => {
  return src("src/assets/styles/*.scss", { base: "src" }) // base 保留文件路径
    .pipe(sass())
    .pipe(dest("dist"));
};

/**
 * @desc: JS 脚本编译
 */
const script = () => {
  return src("src/assets/scripts/*.js", { base: "src" }) // base 保留文件路径
    .pipe(plugins.babel({ presets: ["@babel/preset-env"] }))
    .pipe(dest("dist"));
};

/**
 * @desc: 图片压缩
 */
const image = () => {
  return src("src/assets/images/**", { base: "src" })
    .pipe(plugins.imagemin())
    .pipe(dest("dist"));
};

/**
 * @desc: 字体压缩
 */
const font = () => {
  return src("src/assets/fonts/**", { base: "src" })
    .pipe(plugins.imagemin())
    .pipe(dest("dist"));
};

/**
 * @desc: 其他静态文件
 */
const extra = () => {
  return src("public/**", { base: "public" }).pipe(dest("dist"));
};

/**
 * @desc: 清理 dist 文件
 */
const clean = () => del(["dist"]);

// 需要对外提供的任务
const complie = parallel(page, style, script, image, font);
const build = series(clean, parallel(complie, extra));

module.exports = {
  clean,
  complie,
  build,
};
