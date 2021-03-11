<template>
  <div class='fans-container'>
   <el-card class="main-card">
      <div slot="header" class="clearfix">
       <!-- 面包屑路径导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right" class='bread'>
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>粉丝管理</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- /面包屑路径导航 -->
      </div>   
       <el-tabs type="border-card">
         <el-tab-pane>
            <span slot="label"><i class="iconfont icon-tuijian"></i> 推荐关注</span>
            <FanRecommend :showAddbtn='true'/>
         </el-tab-pane>
         <el-tab-pane >
            <span slot="label"><i class="iconfont icon-guanzhu"></i> 关注列表</span>
            <FanRecommend :showfollowed='true'/>
         </el-tab-pane>
         <el-tab-pane >
            <span slot="label"><i class="iconfont icon-ziyuan191"></i> 粉丝列表</span>
            <FanRecommend :showeachfollow='true'/>
         </el-tab-pane>
         <el-tab-pane >
            <span slot="label"><i class="iconfont icon-qushi"></i> 粉丝添加趋势</span>
            粉丝添加趋势
         </el-tab-pane>
        </el-tabs>
    </el-card>
  </div>
</template>
<script>
import FanRecommend from './components/recommend' 
export default {
  name: 'fansIndex',
  components: {
    FanRecommend
  },
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>
<style scoped lang='less'>
</style>
