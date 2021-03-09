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
      <el-form ref="form" :model="article" :rules="rules" label-width="auto"
       
      >
        <el-form-item label="标题" prop='title' >
          <el-col :span="8">
            <el-input v-model="article.title" ></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="内容" prop='content'>
          <el-col :span="16">
            <el-tiptap
             v-model="article.content"
             :extensions="extensions"
             height="350"
            />
            <!-- <el-input type="textarea" v-model="article.content">
            </el-input> -->
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
          <div>
            <el-radio-group v-model="article.cover.type">
              <el-radio :label="0">无图</el-radio>
              <el-radio :label="1">单图</el-radio>
              <el-radio :label="3">三图</el-radio>
            </el-radio-group>
          </div>
          <!-- <template v-if="article.cover.type>0"> -->
            <el-button type="primary" size='small'
              v-if="article.cover.type>0"
              @click='handlerbtnUpload'
            >点我上传封面
              <i class="el-icon-upload el-icon--right"></i>
            </el-button>
            <el-button type="success"  size='small'
             v-if="article.cover.type>0"
             @click='handlerbtnclear'
            >
              清空图片，重新上传
            </el-button>
            <template v-show="isbtnUpload">
              <!-- 这里用v-if第一次的时候还没存在这个组件
              用v-show就会存在，但是没激活的情况 -->
              <upload-cover
                 :limitnum='article.cover.type'
                 @upload-success='onLoadSuccess($event)'
                 ref="uc"
              >
              <!-- $event就是上传过来的url -->
            </upload-cover>
          </template>
          <template v-if="uploadsuccess">
          <div>
            <span class="block" v-for="fit in article.cover.imagesPath" :key='fit'>
              <el-image
                style="width: 120px; height: 120px"
                :src="fit"
                :fit="fit"></el-image>
            </span>
          </div>
          </template>
           <!-- <template v-if="uploadsuccess">
              <img
                v-for="(index,img) in uploadsuccessArr" 
                :src='img'
                @update-success='onSuccessCover($event)'
              >
              $event就是上传过来的url
          </template> -->
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
// import element-tiptap 样式
import 'element-tiptap/lib/index.css'
import {
  Doc,
  Text,
  Paragraph,
  Heading,
  Bold,
  Underline,
  Italic,
  Image,
  Strike,
  ListItem,
  BulletList,
  OrderedList,
  TodoItem,
  TodoList,
  HorizontalRule,
  Fullscreen,
  Preview,
  CodeBlock
} from 'element-tiptap'
import { uploadDraft } from '@/api/upload'
// moments
import { getChannelsList } from '@/api/channel'
import {
  addArticle,
  getArticleById,
  updateArticle
} from '@/api/article'
import UploadCover from '@/views/publish/components/UploadCover'

export default {
  name: 'PublishIndex',
  data () {
    return {
    // 编辑器的 extensions
    // 它们将会按照你声明的顺序被添加到菜单栏和气泡菜单中
      extensions: [
        new Doc(),
        new Text(),
        new Paragraph(),
        new Heading({ level: 3 }),
        new Bold({ bubble: true }), // 在气泡菜单中渲染菜单按钮
        new Image({
          // 【只要上传图片就会触发uploadRequest这个方法】
          // 上传图片默认会把图片生成base64
          // 字符串和内容会存在一起，最好我们把图片自定义上传
          // 当我们上传图片的时候就会触发这个方法，名字可以自定义
          async uploadRequest (file) {
            console.log('uploadrequest...')
            const fd = new FormData()
            fd.append('moments', file)
            const res = await uploadDraft(fd)
            console.log(res.data.url)
            return res.data.url
            // return后面跟的是显示图片的地址
          }
        }),
        new Underline(), // 下划线
        new Italic(), // 斜体
        new Strike(), // 删除线
        new HorizontalRule(), // 华丽的分割线
        new ListItem(),
        new BulletList(), // 无序列表
        new OrderedList(), // 有序列表
        new TodoItem(),
        new TodoList(),
        new Fullscreen(),
        new Preview(),
        new CodeBlock()
      ],
      channels: [], // 文章频道列表
      article: {
        title: '', // 文章标题
        content: '', // 文章内容
        type: 0, // 封面类型
        cover: {
          type: 3,
          imagesPath: []
        },
        channel_id: null,
        status: 2 // 2代表直接发表文章的状态
      },
      rules: {
        title: [
          { required: true, message: '标题不能为空', trigger: 'change' },
          { min: 3, max: 50, message: '标题在 3 到 50 个字符', trigger: 'blur' }
        ],
        content: [
          {
            // 这种是防止输入了，然后删除为空的情况
            validator: (rule, value, callback) => {
              console.log('validator...')
              if (value === '<p></p>') {
                callback(new Error('文章内容不能为空哦'))
              } else {
                callback()
              }
            }
          },
          // 这种是防止一开始就为空的情况
          { required: true, message: '文章内容不能为空', trigger: 'blur' }
        ],
        channel_id: [
          { required: true, message: '请选择频道', trigger: 'change' }
        ]
      },
      uploadsuccess: false,
      isbtnUpload: false
    }
  },
  components: {
    UploadCover
  },
  methods: {
    handlerbtnclear () {
      this.article.cover.imagesPath = []
      this.uploadsuccess = false
    },
    handlerbtnUpload () {
      this.isbtnUpload = true
      this.$refs.uc.dialogVisible = true
    },
    submitForm (status) {
      console.log('想提交的方式' + status)
      // 直接发表文章
      this.article.status = status
      this.submitArticle('form')
    },
    onLoadSuccess ($event) {
      const { arr, uploadSuccess } = $event
      this.uploadsuccess = uploadSuccess
      this.article.cover.imagesPath = arr
    },
    onUpdateCover (index, $event) {
      this.article.cover.imagesPath[index - 1] = $event
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
.block{
  display: inline-block;
  border:1px solid black;
  margin-right: 1px;
  width: 120px;
  height: 120px;
}
</style>
