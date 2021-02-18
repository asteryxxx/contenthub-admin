<template>
      <el-container class='layout-container'>
        <el-aside
          class='aside'
          width='auto'
        ><app-aside class='aside-menu' :isCollapse="isCollapse"/></el-aside>
        <el-container>
          <el-header
            class='header'
          >
          <div>
            <i :class="{
              'el-icon-s-unfold': isCollapse,
              'el-icon-s-fold': !isCollapse
            }" @click='isCollapse = !isCollapse'></i>
            <span>深圳xx科技有限公司</span>
          </div>
        <el-dropdown>
          <div class='right'>
            <img :src="user.avatar_url" alt="" >
            <span>{{user.name}}</span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </div>
         <!-- <span class="el-dropdown-link">
           下拉菜单<i class="el-icon-arrow-down el-icon--right"></i>
         </span> -->
         <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>个人设置</el-dropdown-item>
          <el-dropdown-item
            @click.native='onLogout'
          >用户退出</el-dropdown-item>
         </el-dropdown-menu>
        </el-dropdown>
        </el-header>
          <el-main
            class='main'
          ><router-view></router-view></el-main>
        </el-container>
      </el-container>
        <!-- 子路由的出口 -->
</template>
<script>
import AppAside from './components/aside'
// <AppAside/> 或者驼峰 <app-aside/>
import { getUserProfile } from '@/api/user'

export default {
  name: 'LayoutIndex',
  data () {
    return {
      user: {}, // 当前登陆的用户信息
      isCollapse: false // 侧边菜单栏是否显示
    }
  },
  methods: {
    async loadUserProfile () {
      // 请求获取用户资料
      const res = await getUserProfile()
      this.user = res.data
      console.log(res)
    },
    onLogout () {
      this.$confirm('确定要退出吗', '退出提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 把用户的登陆状态清除掉
        localStorage.removeItem('user')
        // 跳到登陆界面
        this.$router.push('/login')
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  },
  components: {
    AppAside
  },
  created () {
    this.loadUserProfile()
    // 初始化用户信息
  }
}
</script>
<style scoped lang='less'>
/* 方法1：用固定定位/绝对定位设置上下左右距离为0(但脱离文档流；)
#s1{
background-color: green;
position: fixed;/absolute
left: 0;
right: 0;
top: 0;
bottom: 0;
} */
.layout-container {
/* 让元素充满页面 */
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  position: fixed;
}
.aside {
  background-color: #d3dce6;
}
.header {
  /* background-color: #b3c0d1; */
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ccc;
}
.main {
  background-color: #e9eef3;
}
.aside-menu{
  height: 100%;
}
.right {
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    margin-right: 8px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }
}
</style>
