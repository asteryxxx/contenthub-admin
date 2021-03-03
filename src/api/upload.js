/**
 * 图片上传请求相关的模块
 */
import request from '@/utils/request'
export const uploadDraft = data => {
  return request({
    method: 'POST',
    url: '/upload/moments/draftPic',
    data
    // 一般文件上传的接口都要求把请求头中的 Content-Type 设置为 multipart/form-data，
    // 但是我们使用 axios 上传文件的话不需要手动设置，你只要给 data 一个 FormData 对象即可。
    // new FormData()
  })
}
export const uploadSucai = data => {
  return request({
    method: 'POST',
    url: '/images',
    data
  })
}
// 显示全部素材图片
export const getMaterials = params => {
  return request({
    method: 'GET',
    url: '/images',
    params
  })
}
// 查询用户的收藏素材
export const getUserMaterials = (params) => {
  return request({
    method: 'GET',
    url: '/images/collect',
    params
  })
}
// 取消收藏或者收藏
export const CollectOpera = (imageId, params) => {
  return request({
    method: 'PATCH',
    url: '/images/cancel/' + imageId,
    params
    // 如果type传1说明要收藏，传0说明取消收藏
  })
}
// 删除素材图片
export const deletePic = imageId => {
  return request({
    method: 'DELETE',
    url: '/images/' + imageId
  })
}
