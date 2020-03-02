import React, { PureComponent } from 'react';
import mapJSON from '@/assets/jsMap/china';
export default class Map extends PureComponent {

  state = {
    // width: document.body.offsetWidth,
    // height: document.body.offsetHeight,
    scale: document.body.offsetWidth / 800 > document.body.offsetHeight / 600 ? document.body.offsetHeight / 600 : document.body.offsetWidth / 800,
    pins: []
  };

  addPin(item) {
    if (!item) {
      return false;
    }

    let ratio = 5;
    let center = item.area.areaPos[0]

    if (item.id.indexOf(['heilongjiang']) !== -1) {
      ratio = 3;
      center = [
        item.area.areaPos[0][0] + 50,
        item.area.areaPos[0][1] * 1 - 100,
      ];
    }

    if (item.id.indexOf(['jilin']) !== -1) {
      ratio = 5;
      center = [
        item.area.areaPos[0][0] * 1 + 85,
        item.area.areaPos[0][1] * 1 - 45,
      ];
    }

    if (item.id.indexOf(['liaoning']) !== -1) {
      ratio = 7;
      center = [
        item.area.areaPos[0][0] * 1 + 90,
        item.area.areaPos[0][1] * 1 - 22,
      ];
    }

    if (item.id.indexOf(['hebei']) !== -1) {
      ratio = 5.2;
      center = [
        item.area.areaPos[0][0] * 1 + 95,
        item.area.areaPos[0][1] * 1 - 50,
      ];
    }

    if (item.id.indexOf(['beijing']) !== -1) {
      ratio = 20;
      center = [
        item.area.areaPos[0][0] * 1 + 114,
        item.area.areaPos[0][1] * 1 + 4,
      ];
    }

    if (item.id.indexOf(['neimenggu']) !== -1) {
      ratio = 1.9;
      center = [
        item.area.areaPos[0][0] * 1 - 15,
        item.area.areaPos[0][1] * 1 - 160,
      ];
    }

    if (item.id.indexOf(['tianjin']) !== -1) {
      ratio = 20;
      center = [
        item.area.areaPos[0][0] * 1 + 118,
        item.area.areaPos[0][1] * 1 + -2,
      ];
    }

    if (item.id.indexOf(['henan']) !== -1) {
      ratio = 8;
      center = [
        item.area.areaPos[0][0] * 1 + 100,
        item.area.areaPos[0][1] * 1 - 15,
      ];
    }

    if (item.id.indexOf(['shandong']) !== -1) {
      ratio = 8;
      center = [
        item.area.areaPos[0][0] * 1 + 110,
        item.area.areaPos[0][1] * 1 - 20,
      ];
    }

    if (item.id.indexOf(['shanxi']) !== -1) {
      ratio = 6.4;
      center = [
        item.area.areaPos[0][0] * 1 + 90,
        item.area.areaPos[0][1] * 1 - 35,
      ];
    }

    if (item.id.indexOf(['jiangsu']) !== -1) {
      ratio = 8;
      center = [
        item.area.areaPos[0][0] * 1 + 95,
        item.area.areaPos[0][1] * 1 - 12,
      ];
    }

    if (item.id.indexOf(['anhui']) !== -1) {
      ratio = 7.6;
      center = [
        item.area.areaPos[0][0] * 1 + 100,
        item.area.areaPos[0][1] * 1 - 20,
      ];
    }

    if (item.id.indexOf(['hubei']) !== -1) {
      ratio = 6.4;
      center = [
        item.area.areaPos[0][0] * 1 + 85,
        item.area.areaPos[0][1] * 1 - 24,
      ];
    }

    if (item.id.indexOf(['zhejiang']) !== -1) {
      ratio = 12;
      center = [
        item.area.areaPos[0][0] * 1 + 125,
        item.area.areaPos[0][1] * 1 - 6,
      ];
    }

    if (item.id.indexOf(['hunan']) !== -1) {
      ratio = 7;
      center = [
        item.area.areaPos[0][0] * 1 + 92,
        item.area.areaPos[0][1] * 1 - 12,
      ];
    }

    if (item.id.indexOf(['jiangxi']) !== -1) {
      ratio = 7;
      center = [
        item.area.areaPos[0][0] * 1 + 100,
        item.area.areaPos[0][1] * 1 - 10,
      ];
    }

    if (item.id.indexOf(['fujian']) !== -1) {
      ratio = 7;
      center = [
        item.area.areaPos[0][0] * 1 + 96,
        item.area.areaPos[0][1] * 1 - 12,
      ];
    }

    if (item.id.indexOf(['shaanxi']) !== -1) {
      ratio = 4.6;
      center = [
        item.area.areaPos[0][0] * 1 + 72,
        item.area.areaPos[0][1] * 1 - 60,
      ];
    }

    if (item.id.indexOf(['ningxia']) !== -1) {
      ratio = 10;
      center = [
        item.area.areaPos[0][0] * 1 + 102,
        item.area.areaPos[0][1] * 1 - 20,
      ];
    }

    if (item.id.indexOf(['gansu']) !== -1) {
      ratio = 3.2;
      center = [
        item.area.areaPos[0][0] * 1 - 10,
        item.area.areaPos[0][1] * 1 - 100,
      ];
    }

    if (item.id.indexOf(['chongqing']) !== -1) {
      ratio = 10;
      center = [
        item.area.areaPos[0][0] * 1 + 100,
        item.area.areaPos[0][1] * 1 - 12,
      ];
    }

    if (item.id.indexOf(['sichuan']) !== -1) {
      ratio = 4.8;
      center = [
        item.area.areaPos[0][0] * 1 + 58,
        item.area.areaPos[0][1] * 1 - 40,
      ];
    }

    if (item.id.indexOf(['guizhou']) !== -1) {
      ratio = 8;
      center = [
        item.area.areaPos[0][0] * 1 + 90,
        item.area.areaPos[0][1] * 1 - 15,
      ];
    }

    if (item.id.indexOf(['yunnan']) !== -1) {
      ratio = 5;
      center = [
        item.area.areaPos[0][0] * 1 + 75,
        item.area.areaPos[0][1] * 1 - 36,
      ];
    }

    if (item.id.indexOf(['guangxi']) !== -1) {
      ratio = 7;
      center = [
        item.area.areaPos[0][0] * 1 + 85,
        item.area.areaPos[0][1] * 1 - 12,
      ];
    }

    if (item.id.indexOf(['guangdong']) !== -1) {
      ratio = 7;
      center = [
        item.area.areaPos[0][0] * 1 + 90,
        item.area.areaPos[0][1] * 1 - 9,
      ];
    }

    if (item.id.indexOf(['taiwan']) !== -1) {
      center = [
        item.area.areaPos[0][0] * 1 + 140,
        item.area.areaPos[0][1] * 1 + 10,
      ];
    }

    if (item.id.indexOf(['hainan']) !== -1) {
      ratio = 20
      center = [
        item.area.areaPos[0][0] * 1 + 118,
        item.area.areaPos[0][1] * 1 + 8,
      ];
    }

    if (item.id.indexOf(['qinghai']) !== -1) {
      ratio = 5
      center = [
        item.area.areaPos[0][0] * 1 + 60,
        item.area.areaPos[0][1] * 1 - 30,
      ];
    }

    if (item.id.indexOf(['xinjiang']) !== -1) {
      ratio = 2.2;
      center = [
        item.area.areaPos[0][0] * 1 + 10,
        item.area.areaPos[0][1] * 1 - 120,
      ];
    }

    if (item.id.indexOf(['xizang']) !== -1) {
      ratio = 3.6
      center = [
        item.area.areaPos[0][0] * 1 + 30,
        item.area.areaPos[0][1] * 1 - 60,
      ];
    }

    if (item.id.indexOf(['shanghai']) !== -1) {
      ratio = 35
      center = [
        item.area.areaPos[0][0] * 1 + 115,
        item.area.areaPos[0][1] * 1 + 5,
      ];
    }

    if (item.id.indexOf(['xianggang']) !== -1) {
      ratio = 35
      center = [
        item.area.areaPos[0][0] * 1 + 115,
        item.area.areaPos[0][1] * 1 + 5,
      ];
    }

    if (item.id.indexOf(['aomen']) !== -1) {
      ratio = 45
      center = [
        item.area.areaPos[0][0] * 1 + 135,
        item.area.areaPos[0][1] * 1 - 5,
      ];
    }
    //nanhaizhudao
    if (item.id.indexOf(['nanhaizhudao']) !== -1) {
      center = [
        item.area.areaPos[0][0] * 1 + 145,
        item.area.areaPos[0][1] * 1 - 45,
      ];
    }

    let dot = document.createElement('div');
    dot.id = item.id;
    dot.className = 'dot';

    dot.style.left = center[0] + 'px';
    dot.style.top = center[1] + 'px';
    dot.style.animation = `breath 1s ease-out ${Math.random() * 2 + 0.7}s infinite`;
    dot.style.background = {
      checked: 'rgba(255,100,100,1)',
      checking: 'rgba(100,155,255,1)',
      uncheck: 'rgba(200,200,200,1)',
    }[item.status]

    dot.setAttribute('data-title', item.area.areaName);

    if (item.area.areaPos[1]) {
      dot.style.marginLeft = item.area.areaPos[1][0] / ratio + 'px';
      dot.style.marginTop = item.area.areaPos[1][1] / ratio + 'px';
    }

    let tag = document.createElement('span');
    tag.className = 'tag';
    tag.innerText = item.area.areaName;

    dot.appendChild(tag);
    let target = document.querySelector('#' + item.id)
    if (target) {
      window.document.querySelector('#map').replaceChild(dot, target)
    } else {
      window.document.querySelector('#map').appendChild(dot);
    }
  }

  removePin(item) {
    document.querySelector('#' + item.id).remove()
  }

  componentDidMount() {
    window.onresize = () => {
      this.setState({
        scale: document.body.offsetWidth / 800 > document.body.offsetHeight / 600 ? document.body.offsetHeight / 600 : document.body.offsetWidth / 800,
      })
    }
    window.jsMap.config("#map", mapJSON, {
      name: "china",
      width: 900,
      stroke: {
        width: 0.5,
        color: 'rgba(33, 140, 100, 1)'
      },
      fill: {
        basicColor: 'rgba(113, 207, 203,1)',
        hoverColor: 'rgba(66, 179, 179, 1)',
        clickColor: 'rgba(66, 179, 179, 1)'
      },
      tip: false,
      hoverCallback: function (id) {
        // var a = document.querySelector(`path[data-id=${id}]`);
      }
    });
  }

  render() {

    let mapStyle = {
      transform: `scale(${this.state.scale * 1.2}) translate(-50%,-47%)`,
      margin: '40 0',
      position: 'absolute',
      left: '50%',
      top: '50%'
    }
    return (
      <div id="map" style={mapStyle}></div>
    )
  }
}
