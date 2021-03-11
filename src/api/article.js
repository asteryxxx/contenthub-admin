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
// 发表文章
export const addArticle = data => {
  return request({
    method: 'POST',
    url: '/moment',
    data
  })
/*    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    },
    // 设置form - data请求格式
    transformRequest: [
      function (data) {
        let ret = ''
        for (const rr in data) {
          ret += encodeURIComponent(rr) + '=' + encodeURIComponent(data[rr]) + '&'
        }
        return ret
      }
    ]
  }) */
}
// 获取指定的文章根据文章id
export const getArticleById = id => {
  return request({
    method: 'GET',
    url: `/moment/${id}`
  })
}
// 修改文章
export const updateArticle = (data, id) => {
  return request({
    method: 'PATCH',
    url: `/moment/${id}`,
    data
  })
}
// 展示文章的评论状态
export const getShowmomentCommstatus = (params) => {
  return request({
    method: 'GET',
    url: '/comment/momentStatus',
    params
  })
}
// 修改文章的评论状态
export const updatemomentCommStatus = (id, allowComment) => {
  return request({
    method: 'PATCH',
    url: '/comment/momentStatus/' + id,
    data: {
      allow_comment: allowComment
    }
  })
}
