/**
 * 频道请求相关的模块
 */
import request from '@/utils/request'
// 展示所有的频道列表
export const getChannelsList = () => {
  return request({
    method: 'GET',
    url: '/channel'
  })
}
