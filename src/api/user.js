/**
 * 用户请求相关的模块
 */
import request from '@/utils/request'
// 用户登陆
export const login = data => {
  return request({
    method: 'POST',
    url: '/login',
    data: data
    // data就是用来设置post请求体,data: this.user
  })
}

// 获取用户信息
export const getUserProfile = () => {
  return request({
    method: 'GET',
    url: '/users/profile'
  })
}

// 验证token是否有效
export const testToken = () => {
  return request({
    method: 'GET',
    url: '/testtoken'
  })
}
// 修改用户信息
export const updateUser = (data) => {
  return request({
    method: 'PATCH',
    url: '/users/update',
    data
  })
}
// 修改头像
export const uploadAvatar = data => {
  return request({
    method: 'POST',
    url: '/upload/avatar',
    data
  })
}
