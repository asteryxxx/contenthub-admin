/**
 * 基于axios封装的模块
 */
import axios from 'axios'

const request = axios.create({
  baseURL: 'http://localhost:8888/'
})
request.interceptors.request.use(config => {
  // 任何请求都会经过这个请求拦截器
  // config是当前请求相关的配置信息对象
  const user = JSON.parse(localStorage.getItem('user'))
  // 从本地存储中取出已经登陆的用户的数据
  if (user) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  // 然后我们就可以在允许请求出去之前定制一些业务，比如统一设置token
  // 【必须return config请求才会真正发出去】
  return config
}, error => {
  // Do something with request error
  return Promise.reject(error)
})
// 请求拦截器【所有需要授权的接口都会经过拦截器直接处理了】
/* instance.interceptors.request.use(config => {
  //    console.log(config);
  const {
    user
  } = store.state; //解构一下
  if (user) {
    //如果用户已经登陆了，统一给接口设置token信息
    config.headers.Authorization =
      `Bearer ${user.token}`;
  }
  // 处理完之后一定要把 config 返回，否则请求就会停在这里
  return config
}, error => {
  // Do something with request error
  return Promise.reject(error)
}) */

/* 不同的axios实例可以有不同的配置，不会冲突
const a = axios.create()
a.defaults.baseURL = '....'
const b = axios.create()
b.defaults.baseURL = '....' */

// 导出请求方法
export default request
