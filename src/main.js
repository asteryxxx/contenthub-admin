import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 导入全局样式
import './styles/index.less'

Vue.config.productionTip = false
// 创建Vue根实例
// 把router配置到根实例中
// 通过render方法把app根组件渲染到#app入口 节点
new Vue({
  router,
  render: h => h(App)
  // el : '#app' 等价 $mount("#app")
}).$mount('#app')
