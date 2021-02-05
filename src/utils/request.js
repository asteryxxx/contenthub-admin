/**
 * 基于axios封装的模块
 */
import axios from 'axios'

const request = axios.create({
    baseURL: 'http://localhost:8888/'
})

//导出请求方法
export default request