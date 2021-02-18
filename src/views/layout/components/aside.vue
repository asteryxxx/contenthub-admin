<template>
    <!-- el-menu-item的Index不能重复 -->
    <!-- Menu属性：router 是否使用 vue-router 的模式，
    启用该模式会在激活导航时以 index 作为 path 进行路由跳转 -->
    <el-menu
      default-active="/"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      router
      class='nav-menu'
      :collapse="isCollapse"
    >
      <el-menu-item index="/">
        <i class="el-icon-s-home"></i>
        <span slot="title">首页</span>
      </el-menu-item>
      <el-menu-item index="/article">
        <i class="el-icon-menu"></i>
        <span slot="title">内容管理</span>
      </el-menu-item>
      <el-menu-item index="/images">
        <i class="iconfont iconimages"></i>
        <span slot="title">素材管理</span>
      </el-menu-item>
      <el-menu-item index="/publish">
        <i class="el-icon-tickets"></i>
        <span slot="title">发布文章</span>
      </el-menu-item>
      <el-menu-item index="/comment">
        <i class="el-icon-receiving"></i>
        <span slot="title">评论管理</span>
      </el-menu-item>
      <el-menu-item index="/fans">
        <i class="el-icon-chat-dot-round"></i>
        <span slot="title">粉丝管理</span>
      </el-menu-item>
      <el-menu-item index="/settings">
        <i class="el-icon-setting"></i>
        <span slot="title">个人设置</span>
      </el-menu-item>
    </el-menu>
</template>
<script>
export default {
  name: 'AsideIndex',
  data () {
    return {}
  },
  props: ['is-collapse'],
  methods: {
  }
}
</script>
<style scoped lang='less'>
.nav-menu{
  .iconfont {
    margin-right: 5px;
    margin-left: 4px;
  }
}
</style>
