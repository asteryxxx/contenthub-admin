<template>
  <div class='Materials-container'>
    <el-card class="box-card">
     <div slot="header" class="clearfix">
       <!-- 面包屑路径导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>素材管理</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- /面包屑路径导航 -->
      </div>
      <div class='btn-header'>
        <el-radio-group v-model="radio1" size="small" @change='changeValue'>
          <el-radio-button label="all">全部</el-radio-button>
          <el-radio-button label="collect">收藏</el-radio-button>
        </el-radio-group>
        <el-button
          type="success"
          size="small"
          @click='dialogUploadVisible=true'>上传素材</el-button>
          <el-dialog
            :visible.sync="dialogUploadVisible"
            width="400px"
            :append-to-body='true'>
              <el-upload
                v-if="dialogUploadVisible"
                class="upload-demo"
                drag
                action="http://127.0.0.1:5000/json/import"
                :http-request="myUpload"
                multiple
                :on-error="uploadFileError"
                :on-success="uploadFileSuccess"
                :headers='uploadHeaders'
                >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
          </el-dialog>
      </div>
      <!-- 参照了 Bootstrap 的 响应式设计，预设了五个响应尺寸：xs、sm、md、lg 和 xl。 -->
    <el-row :gutter="20" class='elrow'>
      <el-col :xs="12" :sm="6" :md="6" :lg="4" v-for="(img, index) in images" :key="index">
        <div class='Pic'>
            <el-image
            style="width: 100px; height: 100px"
            :src="img.url"
            fit="cover"
            ></el-image>
            <div class='mask'>
                <el-button type="warning"
                  :class="img.collectBolean === true ?'el-icon-star-on':'el-icon-star-off'"
                  circle
                  :loading="img.btnloading"
                  @click.native='collectOpera(img)'
                size='mini'></el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  circle size='mini'
                  v-if="radio1 === 'all'"
                  @click.native='deleteSucai(img)'
                ></el-button>
            </div>
        </div>
      </el-col>
    </el-row>
    <!-- 分页组件 -->
      <el-pagination
       class='pagin'
       background
       layout="prev, pager, next"
       :total="totalCount"
       :page-size='pageSize'
       :disabled='pagloading'
       @current-change='onCurrentchange'
       :current-page.sync='currentPage'>
      </el-pagination>
</el-card>
  </div>
</template>
<script>
import {
  getMaterials,
  getUserMaterials,
  uploadSucai,
  CollectOpera,
  deletePic
} from '@/api/upload'
export default {
  name: 'MaterialsIndex',
  data () {
    return {
      pagloading: false, // 分页组件禁用
      radio1: 'all',
      images: null,
      totalCount: 0,
      pageSize: 12,
      currentPage: 1,
      dialogUploadVisible: false, // 显示上传的提示界面
      uploadHeaders: { 'Content-Type': 'application/x-www-form-urlencoded' }
      // headers请求参数合集
    }
  },
  methods: {
    async deleteSucai (img) {
      img.btnloading = true
      // 打开加载中的按钮
      try {
        await deletePic(img.img_id)
        this.$message({
          showClose: true,
          message: '删除素材成功~',
          type: 'success'
        })
        img.btnloading = false
        this.onCurrentchange(this.currentPage)
      } catch (error) {
        this.$message({
          showClose: true,
          message: '操作出错哦~',
          type: 'warning'
        })
      }
    },
    async collectOpera (img) {
      img.btnloading = true
      // 打开加载中的按钮
      try {
        await CollectOpera(
          img.img_id,
          { type: !img.collectBolean === true ? '1' : '0' }
          // 如果type传1说明要收藏，传0说明取消收藏
        )
        this.$message({
          showClose: true,
          message: `${!img.collectBolean === true ? '收藏' : '取消收藏'}成功~`,
          type: 'success'
        })
        img.btnloading = false
        // 关闭加载中
        // 更新视图状态
        img.collectBolean = !img.collectBolean
        this.onCurrentchange(this.currentPage)
      } catch (error) {
        this.$message({
          showClose: true,
          message: '操作出错哦~',
          type: 'warning'
        })
      }
    },
    async myUpload ({ file }) {
      console.log(file)
      const fd = new FormData()
      fd.append('pic2', file)
      try {
        await uploadSucai(fd)
        this.$message({
          showClose: true,
          message: '恭喜你，上传成功~',
          type: 'success'
        })
      } catch (error) {
        this.$message({
          showClose: true,
          message: '上传失败哦~',
          type: 'warning'
        })
      }
      // 隐藏上传
      this.dialogUploadVisible = false
      this.loadAllMaterials()
      this.currentPage = 1
    },
    uploadFileSuccess () {
      console.log('upload success~~~')
    },
    uploadFileError () {
      console.log('upload error~~~')
    },
    // 根据页码查询数据
    onCurrentchange (page) {
      console.log('onCurrentchange...' + page)
      this.currentPage = page
      if (this.radio1 === 'all') {
        console.log('加载全部的')
        this.loadAllMaterials(page)
      } else {
        console.log('加载收藏的的')
        this.loadCollectMaterials(page)
      }
    },
    // 查询全部的素材图片
    async loadAllMaterials (offset = 1) {
      const res = await getMaterials({
        offset,
        size: this.pageSize
      })
      const imagetemp = res.data.data.result
      for (const img of imagetemp) {
        img.collectBolean = JSON.parse(img.isCollected)
        // 这样才会把原来'false'转成boolean类型
        img.btnloading = false
        // 默认为不显示加载中
      }
      this.images = imagetemp
      this.totalCount = res.data.data.totalCount
    },
    async loadCollectMaterials (offset = 1) {
      const res = await getUserMaterials({
        offset,
        size: this.pageSize
      })
      const imagetemp = res.data.data.result
      for (const img of imagetemp) {
        img.collectBolean = Boolean(img.isCollected)
      }
      this.images = imagetemp
      this.totalCount = res.data.data.totalCount
    },
    // change绑定值变化时触发的事件
    changeValue (value) {
      this.currentPage = 1
      // 如果从全部的第3页切换到收藏，就要把页码切换成第1页，这样收藏的页码就不会有问题
      if (value === 'all') {
        // 全部
        this.loadAllMaterials()
      } else {
        // 收藏
        this.loadCollectMaterials()
      }
    }
  },
  created () {
    this.loadAllMaterials()
  }
}
</script>
<style scoped lang='less'>
.btn-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.Pic{
  position: relative;
  .mask{
    text-align: center;
    position: absolute;
    bottom: 5px;
    width: 100px;
    height: 28px;
    opacity: 0.8;
    background-color: grey;
  }
}
.pagin {
  margin-top: 15px;
  text-align: right;
}
</style>
