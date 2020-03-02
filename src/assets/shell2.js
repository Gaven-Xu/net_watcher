const data = require('./all-map.js');
const cityJSON = require('./cityJSON.js');
const fs = require('fs');

let newData = [];

for (const pSpell in data.china) {
  if (data.china.hasOwnProperty(pSpell)) {

    let theProvince = {
      label: data.china[pSpell].name,
      value: pSpell,
      textPosition: data.china[pSpell].textPosition,
      children: []
    }

    let theChildren = data[pSpell];
    for (const cSpell in theChildren) {
      if (theChildren.hasOwnProperty(cSpell)) {
        theProvince.children.push({
          label: theChildren[cSpell].name,
          value: cSpell,
          textPosition: theChildren[cSpell].textPosition,
        })
      }
    }

    newData.push(theProvince)
  }
}

let result = newData.sort((a, b) => {
  return a.value.charCodeAt(0) - b.value.charCodeAt(0)
})

fs.writeFile('./P2Data2.js', 'export default ' + JSON.stringify(result), function (err) {

})
