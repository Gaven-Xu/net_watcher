import { PureComponent } from 'react';
import { Statistic, Icon, Button } from 'antd';
import { Map } from '@/components';
import styles from './index.css';

const electron = window.require('electron');
const { ipcRenderer } = electron;
const { DB } = electron.remote.require('./DB.js');

export default class MapShow extends PureComponent {

  state = {
  }

  addItemToPin(item) {
    try {
      let Map = this.Map;
      Map.addPin(item)
    } catch (err) { }
  }

  addItemsToPins() {
    let that = this;
    let datas = DB.get('records').value().filter(item => item.status !== 'uncheck');
    datas.map(item => {
      that.addItemToPin(item)
    })
  }

  removePin(item) {
    try {
      let Map = this.Map;
      Map.removePin(item)
    } catch (err) { }
  }

  fetchDeadLine() {
    this.setState({
      deadline: DB.get('others.deadline').value()
    })
  }

  componentDidMount() {
    ipcRenderer.on('map-update', (e, values) => {
      if (values && values.status !== 'uncheck') {
        this.addItemToPin(values);
      }
      if (values && values.status === 'uncheck') {
        // 状态更新为 未签约 删除点
        this.removePin(values);
      }
    })
    ipcRenderer.on('map-delete', (e, values) => {
      if (values) {
        this.removePin(values);
      }
    })
    ipcRenderer.on('count-update', (e, values) => {
      this.setState({
        deadline: values
      })
    })
    this.fetchDeadLine()
    setTimeout(() => {
      this.addItemsToPins();
    }, 1000)
  }

  render() {

    let countDown = this.state.deadline && <Statistic.Countdown className={styles.countDown} valueStyle={{ color: '#0f4a34', fontSize: 20 }} value={this.state.deadline} format="D 天 H 小时 m 分钟 s 秒 SSS" />

    let handleBox = (
      <Button.Group className={styles.handleBox}>
        <Button size="large" type="dashed" onClick={() => {
          console.log(!document.fullscreen)
          this.setState({
            fullscreen: !document.fullscreen
          })
          if (!document.fullscreen) {
            document.documentElement.requestFullscreen()
          } else {
            document.exitFullscreen()
          }
        }}>
          {this.state.fullscreen ? <Icon size="large" type="fullscreen-exit" /> : <Icon size="large" type="fullscreen" />}
        </Button>
      </Button.Group>
    )

    return (
      <div>
        <Map ref={n => { this.Map = n }} />
        {countDown}
        {handleBox}
      </div>
    )
  }
}
