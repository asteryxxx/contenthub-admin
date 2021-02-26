<template>
  <div class='publish-container'>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
       <!-- 面包屑路径导航 -->
       <el-breadcrumb separator-class="el-icon-arrow-right">
         <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
         <el-breadcrumb-item>{{ $route.query.id ? '修改' : '发布'}}文章</el-breadcrumb-item>
       </el-breadcrumb>
      </div>
        <!-- /面包屑路径导航 -->
      <!-- 表单 -->
      <el-form ref="form" :model="article" :rules="rules" label-width="auto">
        <el-form-item label="标题" prop='title' >
          <el-col :span="8">
            <el-input v-model="article.title" ></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="内容" prop='content'>
          <el-col :span="16">
            <el-input type="textarea" v-model="article.content">
            </el-input>
          </el-col>
        </el-form-item>
      <el-form-item label="频道:" prop='channel_id'>
       <el-select v-model="article.channel_id" placeholder="请选择频道">
        <el-option
          :label="channel.name "
          :value="channel.id"
          v-for="(channel, index) in channels"
          :key="index">
        </el-option>
      </el-select>
      </el-form-item>
        <el-form-item label="封面">
          <el-radio-group v-model="article.type">
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm(2)">
            {{ $route.query.id ? '修改' : '发布'}}文章</el-button>
          <el-button type="warning" @click="submitForm(0)">存草稿</el-button>
        </el-form-item>
     </el-form>
    </el-card>
  </div>
</template>
<script>
import { getChannelsList } from '@/api/channel'
import {
  addArticle,
  getArticleById,
  updateArticle
} from '@/api/article'

export default {
  name: 'PublishIndex',
  data () {
    return {
      channels: [], // 文章频道列表
      article: {
        title: '', // 文章标题
        content: '', // 文章内容
        type: 0, // 封面类型
        channel_id: null,
        status: 2 // 2代表直接发表文章的状态
      },
      rules: {
        title: [
          { required: true, message: '标题不能为空', trigger: 'change' }
        ],
        content: [
          { required: true, message: '内容不能为空', trigger: 'change' }
        ],
        channel_id: [
          { required: true, message: '请选择频道', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    submitForm (status) {
      console.log('想提交的方式' + status)
      // 直接发表文章
      this.article.status = status
      this.submitArticle('form')
    },
    submitArticle (FormName) {
      this.$refs[FormName].validate(valid => {
        if (!valid) {
          // valid是布尔值，验证是否通过
          console.log('error submit!!')
          return false
        }
      })
      // 验证通过
      // 判断有没id，有就是修改文章，否则就添加
      const articleId = this.$route.query.id
      if (articleId) {
        // 执行修改操作
        updateArticle(this.article, articleId).then(res => {
          this.$message({
            showClose: true,
            message: `${this.article.status === 2 ? '修改' : '存入草稿'}成功~`,
            type: 'success'
          })
        }).catch(error => {
          const tt = { ...error }
          const message = tt.response.data
          this.$message.error(message)
        })
      } else {
        addArticle(this.article).then(res => {
          this.$message({
            showClose: true,
            message: `${this.article.status === 2 ? '发表' : '存入草稿'}成功~`,
            type: 'success'
          })
        }).catch(error => {
          const tt = { ...error }
          const message = tt.response.data
          this.$message.error(message)
        })
      }
      // 跳转到内容管理页面
      this.$router.push('/article')
    },
    async loadChannelsList () {
      const res = await getChannelsList()
      this.channels = res.data
    },
    async loadArticleById () {
      try {
        // 显示要修改之前的数据
        const res = await getArticleById(this.$route.query.id)
        const { cover, channel } = res.data.data
        this.article = res.data.data
        this.article.type = parseInt(JSON.parse(cover).type)
        // 要把cover转成对象形式,而且他下拉框接受的是数字，我们要转一下
        // 因为我们存的是 type:'0' 字符串
        this.article.channel_id = channel.id
      } catch (error) {
        const er = { ...error }
        this.$message.error(er.response.data)
      }
    }
  },
  created () {
    this.loadChannelsList()
    // 我们是发布和修改文章使用的是同一个组件
    // 所以要判断路由路径参数中是否有id，有就展示文章内容
    if (this.$route.query.id) {
      this.loadArticleById()
    }
  }
}
</script>
<style scoped lang='less'>
</style>
