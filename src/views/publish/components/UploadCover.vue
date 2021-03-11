<template>
    <div class='upload-cover' @click='showCoverSelect'>
      <el-dialog
        title="选择封面"
        :visible.sync="dialogVisible"
        width="60%"
        append-to-body
        v-if="dialogVisible"
      >
        <el-tabs type="border-card" class='tabs-cover' v-model='activeName'>
          <el-tab-pane label="素材库" name='one'>素材库</el-tab-pane>
          <el-tab-pane label="上传图片" name='two'>
             <el-upload
              class="upload-demo"
              action=""
              multiple
              ref='upload'
              accept=".jpg,.jpeg,.png"
              :before-upload='handlebeforeupload'
              :http-request='httpRequest'
              :on-change='handleChange'
              :on-remove="handleRemove"
              :file-list="fileList"
              :auto-upload='false'
              list-type="picture">
                <el-button size="small" type="primary">点击上传</el-button>
                <div class='btnarr'>
                  <el-button type="primary" @click="onCoverConfirm">确 定</el-button>
                  <el-button @click="cancelupload">取 消</el-button>
                </div>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb。注意：最大只允许上传{{limitnum}}张哦~</div>
            </el-upload>
          </el-tab-pane>
        </el-tabs>
      </el-dialog>
    </div>
</template>
<script>
import { uploadDraft } from '@/api/upload'
export default {
  name: 'UploadCoverIndex',
  props: ['limitnum'],
  data () {
    return {
      activeName: 'two',
      imagedialogVisible: true,
      dialogVisible: false,
      fileArr: [],
      fileList: []
      /* fileList: [  这里必须是对象，至少包含url，可以包含name
        { url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' },
        { url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' },
        { url: 'http://localhost:8888/users/1/avatar' } 
      ] */
    }
  },
  methods: {
    cancelupload () {
      console.log('cancel...')
      this.dialogVisible = false
      // 点击取消的时候，要把之前的文件数组置为空
      this.fileList = [] 
    },
    // 上传文件之前的钩子，参数为file
    // 若返回 false 或者返回 Promise 且被 reject，则停止上传
    // beforeupload在change前面执行
    handlebeforeupload (file) {
      console.log('handlebeforeupload...')
      if (file.size / 1024 / 1024 > 1) {
        this.$message.error('上传文件不超过1M')
        return false
      }
      const ext = file.name.substring(file.name.lastIndexOf('.') + 1)
      const extension =
        ext === 'jpg' ||
        ext === 'jpeg' ||
        ext === 'png' 
      if (!extension) {
        this.$message.error('上传文件格式只能为jpg,jpeg/png')
        return false
      }
    },
    // 文件列表移除文件时的钩子
    handleRemove (file, fileList) {
      console.log('handlereomove....')
      console.log(file)// 得到要删除的文件
      console.log(fileList)// 文件数组剩余的图片
      this.fileList = fileList
    },
    // 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
    handleChange (file, fileList) {
      console.log('handlechange.....')
      console.log(file)
      // 可以拿到name和url，然后在raw可以拿到原生文件的参数例如name,size,type,uid
      console.log(fileList)
      this.$refs.upload.submit() 
      // 会自动调用 httpRequest方法.在里面取得file
    },
    async httpRequest (param) {
      console.log('httprequest....')
      console.log(param)
      const fileObj = param.file
      // 可以拿到要上传的文件
      console.log(fileObj)
      const formData = new FormData()
      // 循环添加到formData中
      formData.append('moments', fileObj)
      const res = await uploadDraft(formData)
      this.fileList.push({ url: res.data.url[0] })
    },
    showCoverSelect () {
      this.dialogVisible = true
    },
    async onCoverConfirm () {
      if (this.activeName === 'two') {
        if (this.fileList.length === 0) {
          this.$message.error('至少选择上传一张图片~')
          return
        } else if (this.fileList.length > this.limitnum) {
          this.$message.error(`超出了上传的数量~,请上传${this.limitnum}张`)
          return
        }
        console.log('onCoverConfirm...')
        // 上传后显示图片
        // this.$refs['cover-image'].src = this.tempUrl
        // 然后把地址发送给父组件的imagesPath[]
        // this.$emit('update-cover', this.tempUrl)
        const sendArr = []
        for (const ff of this.fileList) {
          sendArr.push(ff.url)
        }
        this.$emit('upload-success', {
          arr: sendArr,
          uploadSuccess: true
        })
        // 关闭弹出层
        this.dialogVisible = false
        this.fileList = []
      } else {
        console.log('素材库提交的')
      }
    },
    handleronexceed () {
      this.$message({
        type: 'error',
        message: `最大只能上传${this.limitnum}张图哦`
      })
    }
  }
}
</script>
<style scoped lang='less'>
.upload-cover{
  .cover-wrap{
    max-width: 100px;
    height: 50px;
    overflow:hidden;
    border: 1px solid grey;
    .cover-image{
      height: 120px;
      max-width: 100%;
    }
  }
}
/deep/ .el-dialog{
  width: 50%;
  height: 90%;
}
/deep/ .el-upload{
  display:flex; 
  flex-direction:row; 
  justify-content:space-between;
}
</style>
