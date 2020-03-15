const appId = 'electron-windows-notifications'
const { ToastNotification } = require('electron-windows-notifications')

exports.default = function (str) {
  let notification = new ToastNotification({
    appId: appId,
    template: `<toast><visual><binding template="ToastText01"><text id="1">%s</text></binding></visual></toast>`,
    strings: [str]
  })

  notification.on('activated', () => console.log('Activated!'))
  notification.show()
}
