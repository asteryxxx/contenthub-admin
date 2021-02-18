/**
 * 用户请求相关的模块
 */
import request from '@/utils/request'
// 用户登陆
export const login = (data) => {
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
