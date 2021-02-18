import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
// 加载element组件库的样式
import 'element-ui/lib/theme-chalk/index.css'
// 导入全局样式
import './styles/index.less'
// 加载nprogress中指定的样式文件
// 注意：加载第三方包中的具体文件不需要写具体路径，直接写包名
// 总结："包名/具体文件路径"
import 'nprogress/nprogress.css'

Vue.use(ElementUI)
// 全局注册element组件库

Vue.config.productionTip = false
// 创建Vue根实例
// 把router配置到根实例中
// 通过render方法把app根组件渲染到#app入口 节点
new Vue({
  router,
  render: h => h(App)
  // el : '#app' 等价 $mount("#app")
}).$mount('#app')
