/**
 * 粉丝模块请求相关的模块
 */
import request from '@/utils/request'
// 展示所有关注列表
export const getShowfollowLists = (params) => {
  return request({
    method: 'GET',
    url: '/userfocus/showfollow',
    params
  })
}
// 查看推荐用户
export const getShowRecommendsLists = (params) => {
  return request({
    method: 'GET',
    url: '/userfocus/showrecommends',
    params
  })
}
// 查看粉丝列表
export const getShowfansLists = (params) => {
  return request({
    method: 'GET',
    url: '/userfocus/showfans',
    params
  })
}
// 移除粉丝
export const deletefan = (id) => {
   return request({
    method: 'DELETE',
    url: '/userfocus/deletefan/'+id
  }) 
}
// 关注用户
export const followuser = (id) => {
   return request({
    method: 'POST',
    url: '/userfocus/followuser/'+id
  }) 
}
