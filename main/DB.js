const { app } = require('electron');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const fs = require('fs')
const path = require('path')
const STORE_PATH = app.getPath('userData');
let DB;

console.log(STORE_PATH)

// 创建数据文件
if (fs.existsSync(path.join(STORE_PATH, '/lowdb.json'))) {
  console.log('The file exists.');
} else {
  console.log('file not exists.');
  fs.writeFileSync(path.join(STORE_PATH, '/lowdb.json'), '', function (err) {

  })
}

// 连接数据库，创建数据库实例
try {
  DB = low(new FileSync(path.join(STORE_PATH, '/lowdb.json')));
} catch (err) {
  fs.copyFileSync(path.join(STORE_PATH, '/lowdb.json'), path.join(STORE_PATH, '/lowdb_bak.json'));
  fs.writeFileSync(path.join(STORE_PATH, '/lowdb.json'), '', function (err) { })
  DB = low(new FileSync(path.join(STORE_PATH, '/lowdb.json')));
}

// 初始化数据库，主要是数据库基本结构
DB.defaults({ records: [], others: {} }).write();

// 拓展数据库方法
DB._.mixin({
  fuzzy: function (arr, text) {
    if (text) {
      return arr.filter(item => {
        return JSON.stringify(item).indexOf(text) !== -1;
      })
    } else {
      return arr;
    }
  },
  fuzzyAnd: function (arr, text) {
    if (text) {
      let textArr = text.trim().replace(/\s{2,}/g, " ").split(" ");
      return arr
        .filter(item => {
          let flag = true;
          let dataStr = JSON.stringify(item)
          textArr.forEach(str => {
            if (!new RegExp(str, 'img').test(dataStr)) {
              flag = false
            }
          })
          return flag
        })
    } else {
      return arr;
    }
  },
  fuzzyOr: function (arr, text) {
    if (text) {
      let regStr = text.trim().replace(/\s{2,}/g, " ").split(" ").join('|')
      return arr
        .filter(item => {
          return new RegExp(regStr, 'img').test(JSON.stringify(item))
        }).sort(function (a, b) {
          return JSON.stringify(b).match(new RegExp(regStr, 'img')).length - JSON.stringify(a).match(new RegExp(regStr, 'img')).length
        })
    } else {
      return arr;
    }
  }
})

// 暴露数据库实例
exports.DB = DB;
