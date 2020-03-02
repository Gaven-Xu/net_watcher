const data = require('./city.js');
const fs = require('fs');

let newData = [];

for (shengCode in data.p) {
  if (data.p.hasOwnProperty(shengCode)) {
    // 省一级循环

    let shengData = {
      label: data.p[shengCode],
      value: shengCode,
      children: []
    }

    let shi = data.c[shengCode];
    for (const shiCode in shi) {
      // 市一级循环
      if (shi.hasOwnProperty(shiCode)) {

        let shiData = {
          label: shi[shiCode],
          value: shiCode,
          children: []
        }

        let xian = data.d[shiCode];
        for (const xianCode in xian) {
          // 区县一级循环
          if (xian.hasOwnProperty(xianCode)) {
            shiData.children.push({
              label: xian[xianCode].name,
              value: xianCode,
              pos: [xian[xianCode].lon, xian[xianCode].lat]
            })
          }
        }

        shengData.children.push(shiData)

      }
    }

    newData.push(shengData)
  }
}

fs.writeFile('./cityJSON.js', 'export default ' + JSON.stringify(newData), function (err) {

})
