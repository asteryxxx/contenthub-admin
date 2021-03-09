<template>
  <div class='comment-container'>
    <el-card class="main-card">
      <div slot="header" class="clearfix">
       <!-- 面包屑路径导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right" class='bread'>
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>评论管理</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- /面包屑路径导航 -->
        <template>
    <el-table
      :data="momentList"
      stripe
      class='list-table'
      border
      header-align='center'
      size='mini'
      style="width: 100%">
    <el-table-column
      align='center'
      fixed
      prop="id"
      label="文章编号"
      width="150">
    </el-table-column>
    <el-table-column
      align='center'
      fixed
      prop="title"
      label="标题"
      width="230">
    </el-table-column>
    <el-table-column
      align='center'
      prop="totalComment"
      label="总评论数"
      width="140">
    </el-table-column>
    <el-table-column
      align='center'
      prop="CanComment"
      label="状态"
      width="180">
        <template slot-scope="scope">
         <el-tag :type="articlesStatus[scope.row.status].type">
          {{ articlesStatus[scope.row.status].text }}</el-tag>
        </template>
    </el-table-column>
     <el-table-column align='center'
        label="操作">
      <!-- 如果需要自定义表格列表模板，则需要把自定义的内容放到template里面 -->
        <template slot-scope="scope">
        <!-- 设置active-value和inactive-value属性，接受Boolean, String或Number类型的值。 -->
          <el-switch
            v-model="scope.row.cancomment"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value="true"
            inactive-value="false"
            :disabled='scope.row.statusDisabled'
            @change="switchChange(scope.row)"
          >
         </el-switch>
        </template>
      </el-table-column>
    </el-table>
   </template>
      </div>

      <!-- 分页组件 -->
      <el-pagination
       class='pagin'
       background
       layout="prev, pager, next"
       :total="totalComment"
       :page-size='pageSize'
       @current-change='onCurrentchange'
       :current-page.sync='currentPage'>
      </el-pagination>
    </el-card>
  </div>
</template>
<script>
import {
  getShowmomentCommstatus,
  updatemomentCommStatus
} from '@/api/article'
export default {
  name: 'commentIndex',
  data () {
    return {
      pageSize: 10,
      currentPage: 1,
      momentList: null,
      totalComment: 0,
      articlesStatus: [
        { status: 0, text: '关闭评论', type: 'danger' },
        { status: 1, text: '正常', type: 'success' }
      ]
    }
  },
  methods: {
    async loadMomentes (offset = 1) {
      const res = await getShowmomentCommstatus({
        offset,
        size: this.pageSize
      })
      this.momentList = res.data.data.results
      for (const moment of this.momentList) {
        moment.cancomment = (moment.status === 1 ? 'true' : 'false')
        moment.statusDisabled = false
        // 为每个遍历的数据添加一个禁用的属性默认为false
      }
      this.totalComment = res.data.data.totalcount
    },
    onCurrentchange (page) {
      this.currentPage = page
      this.loadMomentes(page)
    },
    async switchChange (moment) {
      const { id } = moment
      moment.status = !moment.status === true ? 1 : 0
      // 禁用开关
      moment.statusDisabled = true
      await updatemomentCommStatus(id, moment.status)
      this.$message({
        type: 'success',
        message: moment.status === 1 ? '开启成功' : '关闭成功'
      })
      moment.statusDisabled = false
      // 启动开关
    }
  },
  created () {
    this.loadMomentes()
  }
}
</script>
<style scoped lang='less'>
.bread{
  margin-bottom: 15px
}
.pagin{
  text-align: right
}
</style>
