<template>
  <div class='article-container'>
    <el-card class="filter-card">
      <div slot="header" class="clearfix">
       <!-- 面包屑路径导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>内容管理</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- /面包屑路径导航 -->
      </div>

      <el-form ref="form" label-width="50px" size='mini'>
        <el-form-item label="状态:">
         <el-radio-group v-model="status">
          <el-radio :label="null">全部</el-radio>
          <el-radio :label="0">草稿</el-radio>
          <el-radio :label="1">待审核</el-radio>
          <el-radio :label="2">审核通过</el-radio>
          <el-radio :label="3">审核失败</el-radio>
          <el-radio :label="4">已删除</el-radio>
         </el-radio-group>
        </el-form-item>
      <el-form-item label="频道:">
       <el-select v-model="channel_id" placeholder="请选择频道">
        <el-option
          label='全部'
          :value='null'
        ></el-option>
        <el-option
          :label="channel.name"
          :value="channel.id"
          v-for="(channel, index) in channels"
          :key="index">
        </el-option>
      </el-select>
      </el-form-item>
       <el-form-item label="日期:">
       <el-date-picker
          v-model="rangeDate"
          type="datetimerange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['12:00:00']"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" :disabled='loading'>查询</el-button>
      </el-form-item>
   </el-form>
  </el-card>
   <!-- /数据筛选表单 -->
   <el-card class="box-card">
     <div slot="header" class="clearfix">
        根据筛选条件共查询到 <strong>{{totalCount}}</strong> 条结果：
     </div>
    <!-- 数据列表 -->

    <!-- table表格属性：stripe:是否为斑马纹 -->
    <el-table
      :data="articles"
      stripe
      class='list-table'
      border
      header-align='center'
      size='mini'
      v-loading='loading'
      style="width: 100%">
      <el-table-column
        align='center'
        prop="cover.imagesPath"
        label="封面"
        width="180">
        <template slot-scope="scope">
          <el-image
           v-if="scope.row.cover"
           :src="scope.row.cover.imagesPath[0]"
           fit="contain"
           style="width: 90px; height: 80px"
          >
          <div slot="placeholder" class="image-slot">
            加载中<span class="dot">...</span>
          </div>
          </el-image>
          <el-image v-else style="width: 90px; height: 80px">
          </el-image>
        </template>
      </el-table-column>
      <el-table-column
        align='center'
        prop="title"
        label="标题"
        width="180">
      </el-table-column>
      <el-table-column
        align='center'
        prop="status"
        label="状态">
        <template slot-scope="scope">
         <el-tag :type="articlesStatus[scope.row.status].type">
          {{ articlesStatus[scope.row.status].text }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align='center'
        prop="createAt"
        label="发布时间">
      </el-table-column>
      <el-table-column align='center'
        label="操作">
      <!-- 如果需要自定义表格列表模板，则需要把自定义的内容放到template里面 -->
        <template slot-scope='scope'>
         <el-button type="primary" icon="el-icon-edit" circle></el-button>
         <el-button
          type="danger"
          icon="el-icon-delete"
          circle
          @click='onDeleteArtile(scope.row.id)'
         ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 列表分页 -->
    <!-- 这里要给total属性设置查询到的总条数，他会自己算有几页 -->
      <el-pagination
       class='pagin'
       background
       layout="prev, pager, next"
       :total="totalCount"
       :page-size='pageSize'
       :disabled='loading'
       @current-change='onCurrentchange'
       :current-page.sync='page'>
      </el-pagination>
    <!-- 分页组件中设定的每页数据大小应该和我们请求数据的每页大小保持一致
    ，否则页码计算会有问题 -->
   </el-card>
  </div>
</template>

<script>
import { getMomentList, deleteArticle } from '@/api/article'
import { getChannelsList } from '@/api/channel'

export default {
  name: 'articleIndex',
  data () {
    return {
      channel_id: null, // 频道id
      rangeDate: [],
      articlesStatus: [
        { status: 0, text: '草稿', type: 'info' },
        { status: 1, text: '待审核', type: '' },
        { status: 2, text: '审核通过', type: 'success' },
        { status: 3, text: '审核失败', type: 'warning' },
        { status: 4, text: '已删除', type: 'danger' }
      ],
      articles: [],
      totalCount: 0,
      pageSize: 5,
      status: null, // 查询文章的状态，不传就是全部
      channels: [], // 频道列表
      begin_pubdate: null, // 开始时间
      end_pubdate: null, // 结束时间
      loading: true, // 表单数据加载中loading
      currentPage: 1, // 当前页码
      page: 1
    }
  },
  created () {
    this.loadMomentes(1)
    this.loadChannelsList()
  },
  methods: {
    onDeleteArtile (id) {
      console.log('delete:' + id)
      this.$confirm('确认删除吗?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 确认执行这里
        await deleteArticle(id)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.loadMomentes(this.currentPage)
        // 删除完还要更新当前点击的页码数据
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    async loadChannelsList () {
      const res = await getChannelsList()
      this.channels = res.data
    },
    onSubmit () {
      // 展示加载中
      this.loading = true
      this.loadMomentes(1)
    },
    onCurrentchange (page) {
      // 当我们点击页码的时候同时传page页码参数过来
      console.log('onCurrentchange...' + page)
      this.loadMomentes(page)
      this.currentPage = page
    },
    async loadMomentes (offset = 1) {
      const res = await getMomentList({
        offset,
        size: this.pageSize,
        status: this.status,
        channel_id: this.channel_id,
        // 如果我们后面时间选择那里点了叉叉数组就是[]，要判断一下
        begin_pubdate: this.rangeDate ? this.rangeDate[0] : null,
        end_pubdate: this.rangeDate ? this.rangeDate[1] : null
      })
      console.log(res.data)
      this.articles = res.data.data.results
      this.totalCount = res.data.data.totalcount
      /* entries()，keys()和values() —— 用于遍历数组。它们都返回一个遍历器对象，可以用for...of循环进行遍历，
       唯一的区别是keys()是对键名的遍历、
       values()是对键值的遍历，entries()是对键值对的遍历 */
      if (this.totalCount > 0) {
        // 如果有数据才进行json转换
        for (const [index, art] of this.articles.entries()) {
          console.log(index)
          art.cover = JSON.parse(art.cover)
        }
      }
      // 关闭加载中loading显示
      this.loading = false
    //   console.log(this.articles[0].cover.imagesPath[0])
    }
  }
}
</script>
<style scoped lang='less'>
.box-card{
  margin-top: 15px;
  margin-bottom: 10px;
}
.pagin{
  text-align: right;
}
.list-table {
  margin-bottom:40px;
}
</style>
