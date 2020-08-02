const imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
const execSync = require('child_process').execSync;
const argv = require('yargs').argv;
const whiteList = fs.readFileSync('./whiteList.txt').toString().split('\n');

console.log(chalk.blue('pre-commit hook start! \n'));

let diff;
if (argv.dir === 'all') {
  const root = process.cwd();
  const dir = path.join(root, './src/assets');
  diff = getAllFile(dir);
  console.log(chalk.blue('全量压缩开始! \n'));
} else {
  diff = getDiffFiles();
}
compressPics(diff);

function compressPics(files) {
  const pngs = files.filter(file => file.extName === 'png' && ['a', 'm'].includes(file.status) && !file.isWhiteList);
  let parentFolder = {};
  pngs.forEach(x => { // 根据不同父级目录分类
    let pf = x.subpath.slice(0, x.subpath.lastIndexOf('/'));
    parentFolder[pf] ? parentFolder[pf].push(x.subpath) : parentFolder[pf] = [x.subpath];
  });

  for (let pf in parentFolder) {
    console.log(parentFolder[pf], pf, 'parentFolder');
    imagemin(parentFolder[pf], { // 原图片目录
      destination: pf,      // 生成图片的目录
      plugins: [
        imageminPngquant({
          speed: 1,
          quality: [0.40, 0.50],
        })
      ]
    })
      .then(res => {
        execSync('git add . ');
      })
      .catch(err => {
        console.log(err);
        process.exit(1);
      })
  }
}

function getDiffFiles(type) {
  // pre-commit钩子本身不传递参数
  //https://git-scm.com/docs/githooks/1.7.4#_pre_commit
  // 所以通过git diff 命令拿到本次提交涉及的变动文件
  let root = process.cwd();
  let files = execSync('git diff --cached --name-status HEAD').toString().split('\n');
  let result = [];
  // add, delete, modified, renamed, copied
  type = type || 'admrc';
  let types = type.split('').map(t => {
    return t.toLowerCase();
  });
  files.forEach(file => {
    if (!file) {
      return;
    }
    let temp = file.split(/[\n\t]/);
    let status = temp[0].toLowerCase();
    let filePath = root + '/' + temp[1];
    let extName = path.extname(filePath).slice(1);
    const isWhiteList = Boolean(whiteList.find((item) => {
      return temp[1].includes(item)
    }))

    if (types.length && ~types.indexOf(status)) {
      result.push({
        status: status, // admrc中的一个
        path: filePath, // 绝对路径
        subpath: temp[1], // 相对路径
        extName: extName, // 扩展名
        isWhiteList, // 是白名单文件
      })
    }
  });
  return result;
}

function getAllFile(p, result = []) {
  const statObj = fs.statSync(p);
  if (statObj.isDirectory()) {
    const dirs = fs.readdirSync(p);
    dirs.forEach(dir => { // 循环儿子路径，拼上父亲路径，如果是文件夹就要递归
      let currentPath = path.join(p, dir);
      result.concat(getAllFile(currentPath, result));
    })
    return result;
  } else {
    let subpath = p.slice(p.indexOf('/src/') + 1);
    let extName = path.extname(p).slice(1);
    let isWhiteList = Boolean(whiteList.find((item) => {
      return extName.includes(item);
    }))
    result.push({
      status: 'a', // admrc中的一个
      path: p, // 绝对路径
      subpath, // 相对路径
      extName, // 扩展名
      isWhiteList, // 是白名单文件
    })
    return result;
  }
}
