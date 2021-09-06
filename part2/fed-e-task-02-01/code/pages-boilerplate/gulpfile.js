// 实现这个项目的构建任务

const { src, dest, series, parallel, watch } = require("gulp");

const del = require("del");
const bs = require("browser-sync").create();

// 自动 require 所有的 gulp 插件
const plugins = require("gulp-load-plugins")();
const sass = plugins.sass(require("sass")); // sass 的引入方法需要特殊处理下

// 模板数据
const data = {
  menus: [
    {
      name: "Home",
      icon: "aperture",
      link: "index.html",
    },
    {
      name: "Features",
      link: "features.html",
    },
    {
      name: "About",
      link: "about.html",
    },
    {
      name: "Contact",
      link: "#",
      children: [
        {
          name: "Twitter",
          link: "https://twitter.com/w_zce",
        },
        {
          name: "About",
          link: "https://weibo.com/zceme",
        },
        {
          name: "divider",
        },
        {
          name: "About",
          link: "https://github.com/zce",
        },
      ],
    },
  ],
  pkg: require("./package.json"),
  date: new Date(),
};

/**
 * @desc: HTML 编译
 */
const page = () => {
  return src("src/*.html", { base: "src" })
    .pipe(
      plugins.swig({
        data,
        defaults: { cache: false },
      })
    )
    .pipe(dest("dist"))
    .pipe(bs.reload({ stream: true }));
};

/**
 * @desc: Sass 编译
 */
const style = () => {
  return src("src/assets/styles/*.scss", { base: "src" }) // base 保留文件路径
    .pipe(sass({ outputStyle: "expanded" }))
    .pipe(dest("dist"))
    .pipe(bs.reload({ stream: true }));
};

/**
 * @desc: JS 脚本编译
 */
const script = () => {
  return src("src/assets/scripts/*.js", { base: "src" }) // base 保留文件路径
    .pipe(plugins.babel({ presets: ["@babel/preset-env"] }))
    .pipe(dest("dist"))
    .pipe(bs.reload({ stream: true }));
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

/**
 * @desc: 启动服务，HRM
 */
const serve = () => {
  // 监视文件改动，执行指定任务
  watch("./src/*.html", page);
  watch("./src/assets/styles/*.scss", style);
  watch("./src/assets/scripts/*.js", script);

  // 静态资源、字体和样式不需要执行编译任务，减少构建的任务提高构建效率
  watch(
    ["./src/assets/images/**", "./src/assets/fonts/**", "./public/**"],
    bs.reload
  );

  return bs.init({
    port: 2080, // 默认端口
    open: false, // 是否自动打开
    notify: false, // 服务器连接状态提示
    server: {
      baseDir: ["dist", "src", "public"],
      routes: {
        "/node_modules": "node_modules",
      },
    },
  });
};

// 需要对外提供的任务
const complie = parallel(page, style, script, image, font);
const build = series(clean, parallel(complie, extra));

module.exports = {
  clean,
  complie,
  build,
  serve,
};
