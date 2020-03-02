import moment from 'moment';

// 格式化 时间戳->日期字符串 咿啦看书统一的日期格式
export const formatTime = function (text, type) {

  if (text === '' || text === undefined || text === null) {
    if (type === 'search') {
      return ''
    } else {
      return '-'
    }
  }
  return moment(text).format('YYYY-MM-DD HH:mm:ss')
}

// 格式化 时间戳->日期标签 咿啦看书统一的日期格式
export const formatTimeTag = function (text, type) {
  if (text === '' || text === undefined || text === null) {
    if (type === 'search') {
      return ''
    } else {
      return '-'
    }
  }
  return (<span title={moment(text).format('YYYY-MM-DD HH:mm:ss')}>{moment(text).format('YYYY-MM-DD')}</span>)
}
