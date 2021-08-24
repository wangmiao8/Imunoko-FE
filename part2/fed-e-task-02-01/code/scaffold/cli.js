#!/usr/bin/env node

console.log('cli.js');

const requirer = require('inquirer');
const fs = require('fs')
const path = require('path')
const ejs = require('ejs')

// 命令行交互询问用户问题
requirer.prompt([
  {
    type: 'input',
    name: 'name',
    message: 'Project Name?'
  }
]).then(anwsers => {
  // 模板目录
  const temDir = path.join(__dirname, 'templates')
  // 目标目录
  const destDir = process.cwd()

  fs.readdir(temDir, (err, files) => {
    if(err) throw err
    files.forEach(file => {
      // ejs 渲染模板
      ejs.renderFile(path.join(temDir, file), anwsers, (err, result) => {
        if(err) throw err

        // 写入目标文件路径
        fs.writeFileSync(path.join(destDir, file), result)
      })
    });
  })
})