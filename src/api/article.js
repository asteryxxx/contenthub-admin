/**
 * 文章请求相关的模块
 */
import request from '@/utils/request'
// 展示所有的文章列表
export const getMomentList = params => {
  return request({
    method: 'GET',
    url: '/moment/list',
    params
  })
// Body参数写在query里
// Query参数写在params里
// Headers参数写在headers里
}
// 删除文章
export const deleteArticle = id => {
  return request({
    method: 'DELETE',
    url: `/moment/${id}`
  })
}
