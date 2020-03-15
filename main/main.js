const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const fs = require('fs');
const path = require('path');
const { ping } = require('@network-utils/tcp-ping');
const { DB } = require('./DB.js');
// const Note = require('./Note.js');
// 保持对window对象的全局引用，如果不这么做的话，当JavaScript对象被
// 垃圾回收的时候，window对象将会自动的关闭
// let win, winLink = 'http://localhost:8000';
let win, winLink = process.env.ENV === 'develop' ? 'http://localhost:8000' : path.join(__dirname, '../render/index.html');

function createWindow() {

  // 创建浏览器窗口。
  win = new BrowserWindow({
    autoHideMenuBar: true,
    minWidth: 800,
    minHeight: 600,
    useContentSize: true,
    webPreferences: {
      nodeIntegration: true
    },
    icon: path.join(__dirname, "../public/logo.ico")
  })

  // 然后加载应用的 index.html。
  win.loadURL(winLink)
  // process.env.ENV === 'develop' ? win.loadURL(winLink) : win.loadFile(winLink);

  // 打开开发者工具
  // win.webContents.openDevTools()

  // 等待窗口准备好再显示
  win.once('ready-to-show', () => {
    win.show()
  })

  // 当 window 被关闭，这个事件会被触发。
  win.on('closed', () => {
    // 取消引用 window 对象，如果你的应用支持多窗口的话，
    // 通常会把多个 window 对象存放在一个数组里面，
    // 与此同时，你应该删除相应的元素。
    win = null
  })

}

// Electron 会在初始化后并准备
// 创建浏览器窗口时，调用这个函数。
// 部分 API 在 ready 事件触发后才能使用。
app.on('ready', createWindow)

// 当全部窗口关闭时退出。
app.on('window-all-closed', () => {
  // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
  // 否则绝大部分应用及其菜单栏会保持激活。
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // 在macOS上，当单击dock图标并且没有其他窗口打开时，
  // 通常在应用程序中重新创建一个窗口。
  if (win === null) {
    createWindow()
  }
})
// 在这个文件中，你可以续写应用剩下主进程代码。
// 也可以拆分成几个文件，然后用 require 导入

ipcMain.on('data-backup', () => {
  const STORE_PATH = app.getPath('userData');
  if (fs.existsSync(path.join(STORE_PATH, '/lowdb.json'))) {
    let dialogOptions = {
      defaultPath: 'ella_screen_backup.json',
    }
    dialog
      .showSaveDialog(win, dialogOptions)
      .then(({ canceled, filePath }) => {
        console.log(canceled)
        if (!canceled) {
          fs.copyFileSync(path.join(STORE_PATH, '/lowdb.json'), filePath);
        } else {
          console.log('data-backup canceled')
        }
      })
  } else {
    console.log('file not exists.');
  }
})

ipcMain.on('data-reback', () => {
  const STORE_PATH = app.getPath('userData');
  let dialogOptions = {
    defaultPath: 'ella_screen_backup.json',
  }
  dialog
    .showOpenDialog(win, dialogOptions)
    .then(({ canceled, filePaths }) => {
      if (!canceled) {
        fs.copyFileSync(filePaths[0], path.join(STORE_PATH, '/lowdb.json'));
        app.relaunch();
        app.quit();
      } else {
        console.log('data-reback canceled')
      }
    })
})

ipcMain.on('net-test', () => {

  let hosts = DB.get('records').value();
  let cfg = DB.get('config').value();
  everyTimeFunction = function () { };

  hosts.forEach(function (host) {
    host.handle === 'watching' && ping({
      address: host.address,
      attempts: 4,
      port: host.port,
      timeout: 3000
    }, everyTimeFunction)
      .then(res => {
        win.webContents.send('net-test-result', res);

        if (res.errors.length > cfg.lost) {
          // 超过预设丢包数
          if (cfg.alert.indexOf('ring') !== -1) {
            // 如果，已开启声音提醒
          }
          if (cfg.alert.indexOf('modal') !== -1) {
            // 如果，已开启弹窗提醒
            // Note(`${res.options.address}:丢包超过${cfg.lost}`)
            win.once('focus', () => win.flashFrame(false))
            win.flashFrame(true)
            dialog.showMessageBox({
              title: '网络监测报错',
              type: 'error',
              message: `${res.options.address}:丢包超过${cfg.lost}`
            })
          }
        }

      })
      .catch(err => {
        win.webContents.send('net-test-error', err);
      })
  });

})

// win.webContents.send('data-export', 1)
