import { PureComponent } from 'react';
import { Form, Input, Checkbox, Slider, Button, Modal, Table, Radio, Popconfirm, Icon, message } from 'antd';
import moment from 'moment';
import styles from './index.css';
import { formatTime, formatTimeTag } from '@/utils/index.js';

const electron = window.require('electron');
const { ipcRenderer } = electron;
const { DB } = electron.remote.require('./DB.js');

window.ipInterval = null;

export default @Form.create({ name: 'Index' }) class Index extends PureComponent {
  state = {
    isWatching: false,
    addModalVisible: false,
    settingModalShow: false,
    list: [],
    config: {}
  }

  /**
   * 添加检测地址
   * @param {object} addInfo 全新的地址数据
   */
  addData(addInfo) {
    if (!DB.get('records').find({ address: addInfo.address }).value()) {
      addInfo.handle = 'unwatch';
      DB.get('records').push(addInfo).write();
      message.success('地址添加成功');
      this.setState({
        addModalVisible: false
      })
      this.fetchData()
    } else {
      message.warn('该地址已经存在')
    }
  }

  /**
   * 删除监测地址
   * @param {object} removeInfo 需要删除的地址数据
   */
  deleteData(removeInfo) {
    if (DB.get('records').find({ address: removeInfo.address }).value()) {
      DB.get('records').remove(removeInfo).write();
      // ipcRenderer.send('map-data-delete', removeInfo);
      this.fetchData()
    } else {
      message.warn('数据不存在')
    }
  }

  /**
   * 修改地址数据，主要是状态
   * @param {object} updateInfo 修改之后的地址数据
   */
  changeData(updateInfo) {
    DB.get('records')
      .find({ address: updateInfo.address })
      .assign(updateInfo)
      .write();
    this.fetchData()
  }

  /**
   * 查询列表
   */
  fetchData() {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let search = values.search;
        let list = DB.get('records').fuzzyAnd(search).value();
        this.setState({
          list
        })
        return list;
      }
    })
  }

  // 修改配置
  changeConfig(config) {
    DB.get('config')
      .assign(config)
      .write()
    this.fetchConfig(this.watchingStart)
  }

  // 查询配置
  fetchConfig(cb) {
    this.setState({
      config: { ...DB.get('config').value() }
    }, cb)
  }

  // 开始监听
  watchingStart() {
    clearInterval(window.ipInterval);
    window.ipInterval = setInterval(() => {
      if (this.state.config.rate && this.state.isWatching) {
        ipcRenderer.send('net-test')
      }
    }, parseInt(this.state.config.rate))
  }

  /**
   * 重置搜索条件，重新获取数据
   */
  reset() {
    this.props.form.resetFields();
    this.fetchData()
  }

  componentDidMount() {
    this.fetchData();
    this.fetchConfig();
    // this.fetchCountDownTime();

    // ipcRenderer.on('data-export', (e, values) => {
    //   values && message.success('数据导出成功')
    // })
    ipcRenderer.on('net-test-result', (e, values) => {
      values && console.log('网络监测结果', values)
    })
  }

  render() {

    let self = this;

    let {
      form: { getFieldDecorator }
    } = this.props;

    console.log("当前监听配置", this.state.config)

    let toobar = (
      <div style={{ padding: 10 }}>
        <Form layout="inline">
          <Form.Item>
            <Button type="primary" onClick={() => { this.setState({ addModalVisible: true }) }}>添加监测地址</Button>
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('search', {
              initialValue: ''
            })(
              <Input.Search allowClear enterButton="检索" style={{ width: 300 }} onSearch={this.fetchData.bind(this)} />
            )}
          </Form.Item>
          {
            !this.state.isWatching ? <Form.Item>
              <Button type="primary" onClick={() => {
                this.setState({
                  isWatching: true
                }, this.watchingStart)
              }}>开始监听</Button>
            </Form.Item> :
              <Form.Item>
                <Button type="danger" onClick={() => {
                  this.setState({
                    isWatching: false
                  }, () => {
                    clearInterval(window.ipInterval)
                  })
                }}>关闭监听</Button>
              </Form.Item>
          }
        </Form>
      </div>
    )

    // let dataPop = (
    //   <div>
    //     <div>已签约:{this.state.list.filter(item => item.status === 'checked').length}</div>
    //     <div>签约中:{this.state.list.filter(item => item.status === 'checking').length}</div>
    //     <div>未签约:{this.state.list.filter(item => item.status === 'uncheck').length}</div>
    //   </div>
    // )

    // let timeSet = (
    //   <DatePicker defaultValue={moment(this.state.deadline)} showTime placeholder="Select Time" onChange={this.changeCountDownTime.bind(this)} />
    // )
    return (
      <>
        {toobar}
        <Table
          rowKey="address"
          size="small"
          bordered
          dataSource={this.state.list}
          className={styles.table}
          columns={[
            { title: '标题', dataIndex: 'title' },
            { title: '地址', dataIndex: 'address' },
            { title: '状态', dataIndex: 'status' },
            {
              title: '监听开关',
              dataIndex: 'handle',
              width: 246,
              render(handle, record) {
                return (
                  <>
                    <Radio.Group defaultValue={handle} buttonStyle="solid" size="small" onChange={e => {
                      record.handle = e.target.value;
                      record.updateTime = new Date().getTime();
                      self.changeData(record)
                    }}>
                      <Radio.Button value="watching">开启监听</Radio.Button>
                      <Radio.Button value="unwatch">关闭监听</Radio.Button>
                    </Radio.Group>
                    <Popconfirm
                      placement="topRight"
                      title={<div>确认删除 <strong>{record.username}</strong> ?</div>}
                      onConfirm={() => {
                        self.deleteData(record)
                      }}
                    >
                      <Button size="small" type="danger" style={{ marginLeft: 10 }}><Icon type="delete" /></Button>
                    </Popconfirm>
                  </>
                )
              }
            }
          ].map(item => { item.align = "center"; return item })}
        />
        <div className={styles.footer}>
          <div className={styles.footerTag} onClick={() => {
            this.setState({ settingModalShow: !this.state.settingModalShow })
          }}>
            <Icon type="setting" /> 设置
          </div>
          {/* <div className={styles.footerTag}>
            <Popover placement="topLeft" title='签约数据' content={dataPop} trigger="click">
              <Icon type="database" /> 数据 : {this.state.list.length}
            </Popover>
          </div> */}
          {/* <div className={styles.footerTag}>
            <Popover placement="top" title='倒计时设置' content={timeSet} trigger="click">
              <Icon type="clock-circle" /> 倒计时
            </Popover>
          </div> */}
          {/* <div className={styles.footerTag} onClick={() => {
            ipcRenderer.send('data-backup')
          }}>
            <Icon type="download" /> 数据备份
          </div >
          <div className={styles.footerTag} onClick={() => {
            ipcRenderer.send('data-reback')
          }}>
            <Icon type="upload" /> 数据恢复
          </div > */}
          {/* <div className={styles.footerTag} onClick={() => {
            ipcRenderer.send('map-open')
          }}>
            <Icon type="environment" /> 打开地图
          </div > */}
        </div>
        <AddModal
          title="添加地址"
          visible={this.state.addModalVisible}
          onOk={addInfo => {
            this.addData(addInfo)
          }}
          onCancel={() => {
            this.setState({ addModalVisible: false })
          }}
        />
        <SetModal
          title="设置"
          visible={this.state.settingModalShow}
          initialConfig={this.state.config}
          onOk={setting => {
            console.log(setting)
            this.changeConfig(setting)
          }}
          onCancel={() => {
            this.setState({ settingModalShow: false })
          }}
        />
      </>
    );
  }
}

@Form.create({ name: 'AddModal' }) class AddModal extends PureComponent {

  render() {

    const { getFieldDecorator, resetFields } = this.props.form;

    return (
      <Modal
        {...this.props}
        onOk={() => {
          if (this.props.onOk) {
            this.props.form.validateFields((err, values) => {
              if (!err) {
                this.props.onOk(values);
                resetFields()
              }
            })
          }
        }}
      >
        <Form layout="inline" hideRequiredMark>
          <Form.Item label="标题">
            {getFieldDecorator('title', {
              rules: [{ required: true, message: '请输入地址标题' }],
            })(
              <Input className={styles.input} />
            )}
          </Form.Item>
          <br />
          <Form.Item label="监听地址">
            {getFieldDecorator('address', {
              rules: [{ required: true, message: '请输入IP地址或者域名' }],
            })(
              <Input className={styles.input} />
            )}
          </Form.Item>
          <br />
          <Form.Item label="端口地址">
            {getFieldDecorator('port', {
              rules: [{ required: true, message: '请输入接口地址' }],
            })(
              <Input className={styles.input} />
            )}
          </Form.Item>
        </Form>
      </Modal>
    )
  }

}

@Form.create({ name: 'SetModal' }) class SetModal extends PureComponent {

  render() {

    const { getFieldDecorator, resetFields } = this.props.form;

    return (
      <Modal
        {...this.props}
        onOk={() => {
          if (this.props.onOk) {
            this.props.form.validateFields((err, values) => {
              if (!err) {
                this.props.onOk(values);
                resetFields()
              }
            })
          }
        }}
      >
        <Form layout="inline" hideRequiredMark>
          <Form.Item label="提醒设置">
            {getFieldDecorator('alert', {
              initialValue: this.props.initialConfig.alert || []
            })(
              <Checkbox.Group>
                <Checkbox value="ring">声音提醒</Checkbox>
                <Checkbox value="modal">弹窗提醒</Checkbox>
              </Checkbox.Group>
            )}
          </Form.Item>
          <Form.Item label="监听频率">
            {getFieldDecorator('rate', {
              rules: [{ required: true, message: '监听频率' }],
              initialValue: this.props.initialConfig.rate || 600
            })(
              <Slider className={styles.input} min={600} max={1000 * 5} step={100} />
            )}
          </Form.Item>
          <Form.Item label="掉包提醒">
            {getFieldDecorator('lost', {
              rules: [{ required: true, message: '掉包提醒' }],
              initialValue: this.props.initialConfig.lost || 2
            })(
              <Slider className={styles.input} dots={true} min={1} max={10} />
            )}
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}
