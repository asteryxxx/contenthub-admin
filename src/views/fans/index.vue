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
       <el-tabs type="border-card" v-model="activeName" @tab-click='handleClick'>
         <el-tab-pane name="first">
            <span slot="label"><i class="iconfont icon-tuijian"></i> 推荐关注</span>
            <FanRecommend :showAddbtn='true' :activeName='activeName'  v-if="showAddbtn"/>
         </el-tab-pane>
         <el-tab-pane name="second">
            <span slot="label"><i class="iconfont icon-guanzhu"></i> 关注列表</span>
            <FanRecommend :showfollowed='true' :activeName='activeName'  v-if="showfollowed"/>
         </el-tab-pane>
         <el-tab-pane name="third">
            <span slot="label"><i class="iconfont icon-ziyuan191"></i> 粉丝列表</span>
            <FanRecommend :showeachfollow='true' :activeName='activeName'  v-if="showeachfollow"/>
         </el-tab-pane>
         <el-tab-pane name="four">
            <span slot="label"><i class="iconfont icon-qushi"></i> 粉丝添加趋势</span>
            <Echart v-if="showechart"/>
         </el-tab-pane>
        </el-tabs>
    </el-card>
  </div>
</template>
<script>
import FanRecommend from './components/recommend' 
import Echart from './components/echart' 
export default {
  name: 'fansIndex',
  components: {
    FanRecommend,
    Echart
  },
  data () {
    return {
      activeName: 'first',
      showAddbtn: true,
      showfollowed: false,
      showeachfollow: false,
      showechart: false
    }
  },
  methods: {
    handleClick ({ index, name }) {
      if (name === 'first') {
        this.showAddbtn = true
        this.showfollowed = false
        this.showeachfollow = false
        this.showechart = false
      } else if (name === 'second') {
        this.showAddbtn = false
        this.showfollowed = true
        this.showeachfollow = false
        this.showechart = false
      } else if (name === 'third') {
        this.showAddbtn = false
        this.showfollowed = false
        this.showeachfollow = true
        this.showechart = false
      } else {
        this.showAddbtn = false
        this.showfollowed = false
        this.showeachfollow = false
        this.showechart = true
      }
      this.activeName = name
    }
  }
}
</script>
<style scoped lang='less'>
</style>
