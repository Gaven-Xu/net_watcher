import { PureComponent } from 'react';
import { Form, Input, Button, Modal, Table, Cascader, Radio, Popconfirm, Popover, DatePicker, Icon, message } from 'antd';
import moment from 'moment';
import styles from './index.css';
import P2Data from '@/assets/P2Data2.js';
import { formatTime, formatTimeTag } from '@/utils/index.js';

const electron = window.require('electron');
const { ipcRenderer } = electron;
const { DB } = electron.remote.require('./DB.js');

export default @Form.create({ name: 'Index' }) class Index extends PureComponent {
  state = {
    addModalVisible: false,
    list: []
  }

  /**
   * 添加代理商数据
   * @param {object} addInfo 全新的代理商数据
   */
  addData(addInfo) {
    if (!DB.get('records').find({ id: addInfo.id }).value()) {
      DB.get('records').push(addInfo).write();
      ipcRenderer.send('map-data-update', addInfo);
      message.success('代理商添加成功');
      this.setState({
        addModalVisible: false
      })
      this.fetchData()
    } else {
      message.warn('该地区代理数据已存在')
    }
  }

  /**
   *
   * @param {object} removeInfo 需要删除的代理商数据
   */
  deleteData(removeInfo) {
    if (DB.get('records').find({ id: removeInfo.id }).value()) {
      DB.get('records').remove(removeInfo).write();
      ipcRenderer.send('map-data-delete', removeInfo);
      message.success('删除成功');
      this.fetchData()
    } else {
      message.warn('数据不存在')
    }
  }

  /**
   * 修改代理商数据，主要是状态
   * @param {object} updateInfo 修改之后的代理商数据
   */
  changeData(updateInfo) {
    DB.get('records')
      .find({ id: updateInfo.id })
      .assign(updateInfo)
      .write();
    ipcRenderer.send('map-data-update', updateInfo);
    message.success('编辑成功');
    this.fetchData()
  }

  /**
   * 查询列表
   */
  fetchData() {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let search = values.search.replace('已签约', 'checked').replace('签约中', 'checking').replace('未签约', 'uncheck')
        let list = DB.get('records').fuzzyAnd(search).value();
        this.setState({
          list
        })
        return list;
      }
    })
  }

  /**
   * 导出Excel
   */
  exportExcel() {
    let result = {
      cols: [
        { name: '代理人', key: 0 },
        { name: '联系方式', key: 1 },
        { name: '签约时间', key: 2 },
        { name: '代理地区', key: 3 },
        { name: '签约状态', key: 4 }
      ],
      data: this.state.list.map(item => {
        return [
          item.username,
          item.mobile,
          formatTime(item.addTime),
          item.area.areaName,
          {
            'checked': '已签约',
            'checking': '签约中',
            'uncheck': '未签约',
          }[item.status],
        ]
      })
    }
    ipcRenderer.send('map-data-export', result, 'FILE' + new Date().getTime());
  }

  /**
   * 重置搜索条件，重新获取数据
   */
  reset() {
    this.props.form.resetFields();
    this.fetchData()
  }

  /**
   *
   * @param {*} moment 时间对象
   * 1. 存储倒计时deadline到数据库
   * 2. 通知倒计时已修改——主进程 转发到 地图
   * 3. 修改state，单向绑定到日期输入框
   * 4. 通知修改成功
   */
  changeCountDownTime(moment) {
    let time = !!moment ? moment.format() : null;
    DB.set('others.deadline', time).write();
    ipcRenderer.send('count-update', time);
    this.setState({
      deadline: time
    })
    message.success('修改成功');
  }

  /**
   * 查询当前设置的倒计时
   */
  fetchCountDownTime() {
    this.setState({
      deadline: DB.get('others.deadline').value()
    })
  }

  componentDidMount() {
    this.fetchData();
    this.fetchCountDownTime();
    ipcRenderer.on('data-export', (e, values) => {
      values && message.success('数据导出成功')
    })
  }

  render() {

    let self = this;

    let {
      form: { getFieldDecorator }
    } = this.props;

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
              <Input.Search enterButton="检索" style={{ width: 300 }} onSearch={this.fetchData.bind(this)} />
            )}
          </Form.Item>
          <Form.Item>
            <Button type="default" onClick={this.reset.bind(this)}>重置</Button>
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={this.exportExcel.bind(this)}>导出</Button>
          </Form.Item>
          <Form.Item>
            多条件搜索请用空格隔开
          </Form.Item>
        </Form>
      </div>
    )

    let dataPop = (
      <div>
        <div>已签约:{this.state.list.filter(item => item.status === 'checked').length}</div>
        <div>签约中:{this.state.list.filter(item => item.status === 'checking').length}</div>
        <div>未签约:{this.state.list.filter(item => item.status === 'uncheck').length}</div>
      </div>
    )

    let timeSet = (
      <DatePicker defaultValue={moment(this.state.deadline)} showTime placeholder="Select Time" onChange={this.changeCountDownTime.bind(this)} />
    )
    return (
      <>
        {toobar}
        <Table
          rowKey="id"
          size="small"
          bordered
          dataSource={this.state.list}
          className={styles.table}
          columns={[
            { title: '代理人', dataIndex: 'username' },
            { title: '联系方式', dataIndex: 'mobile' },
            { title: '签约时间', dataIndex: 'addTime', render: formatTimeTag },
            // { title: '更新时间', dataIndex: 'updateTime', render: formatTime },
            { title: '代理地区', render(record) { return record.area.areaName } },
            {
              title: '操作',
              dataIndex: 'status',
              width: 246,
              render(status, record) {
                return (
                  <>
                    <Radio.Group defaultValue={status} buttonStyle="solid" size="small" onChange={e => {
                      record.status = e.target.value;
                      record.updateTime = new Date().getTime();
                      self.changeData(record)
                    }}>
                      <Radio.Button value="checked">已签约</Radio.Button>
                      <Radio.Button value="checking">签约中</Radio.Button>
                      <Radio.Button value="uncheck">未签约</Radio.Button>
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
          <div className={styles.footerTag}>
            <Popover placement="topLeft" title='签约数据' content={dataPop} trigger="click">
              <Icon type="database" /> 数据 : {this.state.list.length}
            </Popover>
          </div>
          <div className={styles.footerTag}>
            <Popover placement="top" title='倒计时设置' content={timeSet} trigger="click">
              <Icon type="clock-circle" /> 倒计时
            </Popover>
          </div>
          <div className={styles.footerTag} onClick={() => {
            ipcRenderer.send('data-backup')
          }}>
            <Icon type="download" /> 数据备份
          </div >
          <div className={styles.footerTag} onClick={() => {
            ipcRenderer.send('data-reback')
          }}>
            <Icon type="upload" /> 数据恢复
          </div >
          <div className={styles.footerTag} onClick={() => {
            ipcRenderer.send('map-open')
          }}>
            <Icon type="environment" /> 打开地图
          </div >
        </div>
        <AddModal
          title="添加代理商"
          visible={this.state.addModalVisible}
          onOk={addInfo => {
            this.addData(addInfo)
          }}
          onCancel={() => {
            this.setState({ addModalVisible: false })
          }}
        />
      </>
    );
  }
}

@Form.create({ name: 'AddModal' }) class AddModal extends PureComponent {
  codeToCity(codeArr) {
    let areaName = '', areaCode = '', areaPos = [];
    P2Data.forEach(province => {
      if (codeArr[0] && province.value === codeArr[0]) {
        areaName += province.label;
        areaCode += province.value;
        areaPos.push(province.textPosition)
        province.children.map(city => {
          if (codeArr[1] && city.value === codeArr[1]) {
            areaName += ('-' + city.label);
            areaCode += ('-' + city.value);
            areaPos.push(city.textPosition)
          }
        })
      }
    })
    return {
      areaName,
      areaCode,
      areaPos
    }
  }
  collect() {
  }
  filter(inputValue, path) {
    return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
  }
  render() {

    const { getFieldDecorator } = this.props.form;

    return (
      <Modal
        {...this.props}
        onOk={() => {
          if (this.props.onOk) {
            this.props.form.validateFields((err, values) => {
              if (!err) {
                let addInfo = values.add
                addInfo.area = this.codeToCity(addInfo.area)
                addInfo.id = addInfo.area.areaCode + '-' + addInfo.mobile;
                addInfo.addTime = new Date().getTime();
                addInfo.updateTime = new Date().getTime();
                this.props.onOk(addInfo)
              }
            })
          }
        }}
      >
        <Form layout="inline" hideRequiredMark>
          <Form.Item label="姓名称谓">
            {getFieldDecorator('add.username', {
              rules: [{ required: true, message: '请输入姓名' }],
            })(
              <Input className={styles.input} />,
            )}
          </Form.Item>
          <br />
          <Form.Item label="联系方式">
            {getFieldDecorator('add.mobile', {
              rules: [{ required: true, message: '请输入联系方式' }],
            })(
              <Input className={styles.input} />,
            )}
          </Form.Item>
          <br />
          <Form.Item label="代理地区">
            {getFieldDecorator('add.area', {
              rules: [{ required: true, message: '请选择代理地区' }],
            })(
              <Cascader
                options={P2Data}
                placeholder="选择代理区域"
                className={styles.input}
                changeOnSelect
                showSearch={{ filter: this.filter }}
              />
            )}
          </Form.Item>
          <br />
          <Form.Item label="签约状态">
            {getFieldDecorator('add.status', {
              rules: [{ required: true, message: '请选择代理地区' }],
              initialValue: "checked"
            })(
              <Radio.Group buttonStyle="solid">
                <Radio.Button value="checked">签约</Radio.Button>
                <Radio.Button value="checking">意向签约</Radio.Button>
                <Radio.Button value="uncheck">未签约</Radio.Button>
              </Radio.Group>
            )}
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}

