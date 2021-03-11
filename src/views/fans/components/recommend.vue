<template>
  <div class='recommend-container'>
    <el-row :gutter="10">
     <el-col :xs="8" :sm="6" :md="4" :lg="4" 
       v-for="(user, index) in list" 
       :key="index"
     >
        <div class='inform-cover'>
            <el-avatar :src="user.avatar_url"
              size="large"
            ></el-avatar> 
           <div class='name'>{{user.name}}</div>
           <div class='sign'><strong>简介</strong>：{{user.sign}}</div>
           <template v-if="showAddbtn"> 
            <el-button type="primary" round size="medium">+关注</el-button>
           </template>
           <template v-if="showfollowed"> 
            <el-button type="info" round size="medium">已经关注</el-button>
           </template>
           <template v-if='showeachfollow'> 
            <el-button type="danger" round size="medium">互相关注</el-button>
           </template>
        </div>
     </el-col>
    </el-row>
    <!-- 列表分页 -->
    <!-- 这里要给total属性设置查询到的总条数，他会自己算有几页 -->
      <el-pagination
       class='pagin'
       background
       layout="prev, pager, next"
       :total="totalcount"
       :page-size='pageSize'
       :disabled='loading'
       @current-change='onCurrentchange'
       :current-page.sync='page'>
      </el-pagination>
    <!-- 分页组件中设定的每页数据大小应该和我们请求数据的每页大小保持一致
    ，否则页码计算会有问题 -->
  </div>
</template>
<script>
import {
  getShowRecommendsLists
} from '@/api/fansfocus'
export default {
  name: 'recommendIndex',
  props: {
    showAddbtn: {
      type: Boolean,
      default: false
    },
    showfollowed: {
      type: Boolean,
      default: false
    },
    showeachfollow: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      list: [],
      totalcount: '',
      pageSize: 12,
      page: 1
    }
  },
  methods: {
    async loadrecommendList (offset = 1) {
      const res = await getShowRecommendsLists({
        offset,
        size: this.pageSize
      })
      this.list = res.data.data.results
      this.totalcount = res.data.data.totalcount
    },
    onCurrentchange (page) {
      // 当我们点击页码的时候同时传page页码参数过来
      this.loadrecommendList(page)
    }
  },
  created () {
    this.loadrecommendList()
  }
}
</script>
<style scoped lang='less'>
.inform-cover{
  margin-top: 3px;
  width: 100%-10px;
  height: 220px;
  border:1px solid gainsboro;
  text-align: center;
  .name{
    margin-top: 10px;
    font-size: 13px;
  }
  .sign{
    text-indent: 8px;
    text-align: center;
    margin-top: 12px;
    font-size: 13px;
    margin-bottom: 11px;
  }
}
/deep/ .el-avatar {
  img{
    width: 100%;
    height: 100%;
  }
  margin-top: 5px;
  width: 55%;
  height: 40%;
}
.pagin{
  margin-top: 8px;
  text-align: right;
}
</style>
