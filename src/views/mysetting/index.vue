<template>
  <div class='mysetting-container'>
    <el-card class="main-card">
      <div slot="header" class="clearfix">
       <!-- 面包屑路径导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right" class='bread'>
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>个人设置</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- /面包屑路径导航 -->
      </div>
      <el-row :gutter="20">
       <el-col :span="16">
          <!-- 表单 -->
          <el-form ref="form" :model="user" :rules="rules"  label-width="auto">
        <el-form-item label="名字：" >
          <el-col :span="8">
            <div>{{user.name}}</div>
          </el-col>
        </el-form-item>
        <el-form-item label="手机号：" >
          <el-col :span="8">
            <div>{{user.telephone}}</div>
          </el-col>
        </el-form-item>
        <el-form-item label="性别：" prop='sex'>
          <el-col :span="8">
            <el-radio v-model="user.sex" :label="1">男</el-radio>
            <el-radio v-model="user.sex" :label="0">女</el-radio>
          </el-col>
        </el-form-item>
        <el-form-item label="介绍签名：" prop='sign'>
          <el-col :span="16">
            <el-input
             type="textarea"
             :rows="2"
             v-model="user.sign">
            </el-input>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitUser('form')">
            保存</el-button>
        </el-form-item>
     </el-form>
          <!-- /表单 -->
       </el-col>
       <el-col :span="8">
         <el-image
           style="width: 100px; height: 100px"
           :src="user.avatar_url"
           fit="cover"
           @click.native='imageclick'>
          </el-image>
          <div>点击图片可修改头像</div>
          <!-- <label for='file'>点击文字可以弹出上传文件窗口</label> -->
          <input 
            id='file'
            type='file'
            hidden
            ref='file'
            @change="onFileChange"
          >
          <el-dialog
            title="修改头像"
            :visible.sync="dislogVisible"
            width="45%"
            append-to-body
            @opened="openeddialog"
            @closed="closedialog"
           >
           <div class='preview-image-wrap'>
             <img
               ref='preview-image'
               class='preview-image'
               :src="previewImage"
             >
           </div>
          <span slot="footer" class="dialog-footer">
              <el-button @click.native="dislogVisible=false">取 消</el-button>
             <el-button 
               type="primary" 
               @click.native="confirmupdate"
               :loading="updatePhotoloading">
             确 定</el-button>
          </span>
          </el-dialog>
       </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
import { 
  getUserProfile,
  uploadAvatar,
  updateUser
} from '@/api/user'
import gloalbus from '@/utils/gloalbus'
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
export default {
  name: 'mysettingIndex',
  data () {
    return {
      user: {
        sex: 1,
        sign: null,
        name: null,
        telephone: null,
        id: null,
        avatar_url: ''
      },
      previewImage: null,
      dislogVisible: false,
      cropper: null,
      updatePhotoloading: false,
      rules: {
        sign: [
          { required: true, message: '签名不能为空', trigger: 'change' },
          { min: 3, max: 50, message: '标题在 3 到 50 个字符', trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '请选择性别', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    async loadUserProfile () {
      // 请求获取用户资料
      const res = await getUserProfile()
      this.user = res.data
    },
    submitUser (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          await updateUser(this.user)
          this.$message({
            type: 'success',
            message: '更新用户信息成功'
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    confirmupdate () {
      this.updatePhotoloading = true
      // 获取裁切的图片对象
      const formData = new FormData()
      this.cropper.getCroppedCanvas().toBlob(async (file) => {
        formData.append('avatar', file)
        const res = await uploadAvatar(formData)
        console.log(res)
        // 关闭对话框
        this.dislogVisible = false
        this.user.avatar_url = window.URL.createObjectURL(file)
        this.$message({
          type: 'success',
          message: '更新头像成功'
        })
        this.updatePhotoloading = false
        // 更新顶部登陆用户信息，发送事件
        gloalbus.$emit('update-user', this.user)
      })
    },
    imageclick () {
      this.$refs.file.click()
    },
    onFileChange () {
      // 处于图片预览
      const file = this.$refs.file.files[0]
      const blobData = window.URL.createObjectURL(file)
      console.log(blobData)
      // 构造url地址
      this.previewImage = blobData
      // 展示弹出层，预览用户选择的图片
      this.dislogVisible = true
      // 解决选择了相同的文件也会触发change事件
      this.$refs.file.value = ''
    },
    openeddialog () {
      // opened事件。Dialog 彻底被打开动画结束时的回调
      // 图片的裁切器必须是基于Img进行初始化的
      // 必须等图片显示完才可以初始化裁切器
      const image = this.$refs['preview-image']
      // 获取到图片的dom节点
      /*  第一次初始化后，如果预览裁切的图片发生了变化，裁切器默认不会更新
      如果需要预览图片发送变化更新裁切器：
      1、裁切器.replace方法
      2、销毁裁切器，重新初始化 */
      if (this.cropper) {
        // 新图像的大小与旧图像的大小相同，则它将不会重建裁剪器，而只会更新所有相关图像的URL
        this.cropper.replace(this.previewImage)
        return
      }
      this.cropper = new Cropper(image, {
        aspectRatio: 16 / 9,
        viewMode: 1, // 1：限制裁切框不要超过画布的大小
        dragMode: 'none',
        cropBoxMovable: true, // 启用通过拖动来移动裁剪框的功能
        cropBoxResizable: true,
        movable: true
      }) 
    },
    closedialog () {
    // 对话框关闭，销毁裁切器
      this.cropper.destroy()
    }
  },
  created () {
    this.loadUserProfile()
  }
}
</script>
<style scoped lang='less'>
.preview-image-wrap{
  .preview-image{
    display: block; 
    /* This rule is very important, please don't ignore this */
    max-width: 100%;
    height:200px;
  }
}
</style>
