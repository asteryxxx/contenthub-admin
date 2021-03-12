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
           <template v-if="showAddbtn" > 
            <el-button 
              :type="user.followSuccess? 'info':'primary'"
              @click='followclick(user)'
              :loading='user.isaddloading'
              :disabled='user.followSuccess'
              round 
              size="medium" 
            >{{user.followSuccess ? '已关注':'+关注'}}</el-button>
           </template>
           <template v-if="showfollowed"> 
             <el-button 
               :type="user.cancelSuccess? 'primary':'info'"
               round 
               size="medium"
               :loading='user.isaddloading'
               @click='cancelclick(user)'
             >{{user.cancelSuccess ? '+关注':'已关注'}}</el-button>
           </template>
           <template v-if='showeachfollow'> 
            <el-button 
              :type="user.status === '关注'? 'primary':'danger'"
              round
              :loading='user.isaddloading'
              @click='canceleachclick(user)'
              size="medium">
            {{user.status}}</el-button>
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
       @current-change='onCurrentchange'
       :current-page.sync='page'>
      </el-pagination>
    <!-- 分页组件中设定的每页数据大小应该和我们请求数据的每页大小保持一致
    ，否则页码计算会有问题 -->
  </div>
</template>
<script>
import {
  getShowRecommendsLists,
  getShowfollowLists,
  getShowfansLists,
  followuser,
  deletefan
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
    },
    activeName: {
      type: String,
      default: 'one'
    }
  },
  data () {
    return {
      list: [],
      totalcount: 0,
      pageSize: 12,
      page: 1
    }
  },
  watch: {
    activeName: function (val) {
      console.log(val)
    }
  },
  methods: {
    async canceleachclick (user) {
      user.isaddloading = true
      if (user.status === '关注') {
        await followuser(user.id)
        this.$message({
          message: '恭喜你，关注成功',
          type: 'success'
        })
      } else {
        await deletefan(user.id)
        this.$message({
          message: '取消关注成功',
          type: 'success'
        })
      }
      this.$forceUpdate()
      user.isaddloading = false
      user.status = `${user.status === '关注' ? '互相关注' : '关注'}`
    },
    cancelclick (user) {
      user.isaddloading = true
      this.$confirm(`是否${user.cancelSuccess ? '关注' : '取消关注'}：${user.name}`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: `${user.cancelSuccess ? 'info' : 'error'}`
      }).then(async () => {
        if (user.cancelSuccess) {
          // 说明要关注
          await followuser(user.id)
        } else {
          // 说明要取消
          await deletefan(user.id)
        }
        this.$forceUpdate()
        this.$message({
          type: 'success',
          message: `${user.cancelSuccess ? '关注' : '取消关注'}成功!`
        })
        user.cancelSuccess = !user.cancelSuccess
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消操作'
        })   
      })
      user.isaddloading = false
    },
    async followclick (user) {
      user.isaddloading = true
      await followuser(user.id)
      this.$message({
        message: '恭喜你，关注成功',
        type: 'success'
      })
      this.$forceUpdate()
      /* v-for循环中，给某些组件（此处以checkBox为例）赋值后，组件并不能正常切换，
      这是因为数据层太多，render函数没有自动更新，需手动强制刷新 */
      user.isaddloading = false
      user.followSuccess = true
    },
    // 查询推荐用户数据
    async loadrecommendList (offset = 1) {
      const res = await getShowRecommendsLists({
        offset,
        size: this.pageSize
      })
      this.list = res.data.data.results
      for (const user of this.list) {
        user.isaddloading = false
        user.followSuccess = false
      }
      this.totalcount = res.data.data.totalcount
    },
    // 查询关注用户数据
    async loadrefollowList (offset = 1) {
      const res = await getShowfollowLists({
        offset,
        size: this.pageSize
      })
      for (const user of this.list) {
        user.isaddloading = false
        user.cancelSuccess = false
      }
      this.list = res.data.data.results
      this.totalcount = res.data.data.totalcount
    },
    // 查询粉丝用户数据
    async loadrefansList (offset = 1) {
      const res = await getShowfansLists({
        offset,
        size: this.pageSize
      })
      this.list = res.data.data.results
      for (const user of this.list) {
        user.isaddloading = false
        user.cancelSuccess = false
      }
      this.totalcount = res.data.data.totalcount
    },
    onCurrentchange (page) {
      // 当我们点击页码的时候同时传page页码参数过来
      if (this.activeName === 'first') {
        this.loadrecommendList(page)
      } else if (this.activeName === 'second') {
        this.loadrefollowList(page)
      } else if (this.activeName === 'third') {
        this.loadrefansList(page)
      }
    }
  },
  created () {
    // 这个只有在第一次创建组件的时候才会调用
    // this.loadrecommendList()
  },
  mounted () {
    this.page = 1
    // 我们后面不断切换tab组件时，2、触发mounted这个钩子
    console.log('mounted...' + this.activeName)
    if (this.activeName === 'first') {
      this.loadrecommendList()
    } else if (this.activeName === 'second') {
      this.loadrefollowList()
    } else if (this.activeName === 'third') {
      this.loadrefansList()
    }
  },
  destroyed () {
    // 切换tabs组件时，1、销毁会触发这个钩子
    console.log('destyoryed...' + this.activeName)
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
