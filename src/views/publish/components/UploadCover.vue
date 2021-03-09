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
            最大只允许上传{{limitnum}}张哦~
             <el-upload
                action="https://jsonplaceholder.typicode.com/posts/"
                list-type="picture-card"
                :on-success='handlesuccess'
                :before-upload='handlebeforeupload'
                :on-exceed='handleronexceed'
                :on-error='handuploaderror'
                :limit="limitnum"
                :on-remove="handleRemove">
               <i class="el-icon-plus"></i>
             </el-upload>
             <el-dialog :visible.sync="imagedialogVisible">
             <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
          </el-tab-pane>
        </el-tabs>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="onCoverConfirm">确 定</el-button>
        </span>
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
      activeName: 'one',
      imagedialogVisible: false,
      dialogImageUrl: '',
      dialogVisible: false,
      tempfile: null,
      tempUrl: '',
      fileArr: [],
      sendfatherArr: [],
      num: 8
    }
  },
  methods: {
    showCoverSelect () {
      this.dialogVisible = true
    },
    handuploaderror () {
      console.log('upload失败')
      this.fileArr.splice(this.fileArr.length - 1, 1)
    },
    handlebeforeupload (file) {
      const testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
      const extension = testmsg === 'jpg'
      const extension2 = testmsg === 'png'
      const extension3 = testmsg === 'jpeg'
      if (!extension && !extension2 && !extension3) {
        this.$message.error('请上传jpg/png/jpeg的图片!')
        return false
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
        return false
      }
      console.log(file)
      this.fileArr.push(file)
    },
    handlesuccess (file) {
    //   console.log(file)    
    //   this.fileArr.push(file[0])
    //   console.log(this.fileArr)
    },
    handleRemove (file, fileList) {
      this.fileArr = this.fileArr.filter(ele => {
        return ele.uid !== file.uid
        // 把文件一样的过滤掉删除
      })
    },
    async onCoverConfirm () {
      if (this.activeName === 'two') {
        if (this.fileArr.length === 0) {
          this.$message.error('至少选择上传一张图片~')
          return
        } else if (this.fileArr.length > this.limitnum) {
          this.$message.error('超出了上传的数量~')
          return
        }
        console.log('onCoverConfirm...')
        // 执行上传操作
        const formData = new FormData()
        for (const ff of this.fileArr) {
          formData.append('moments', ff)
          const res = await uploadDraft(formData)
          this.sendfatherArr.push(res.data.url)  
        }
        console.log(this.sendfatherArr)
        // 关闭弹出层
        this.dialogVisible = false
        // 上传后显示图片
        // this.$refs['cover-image'].src = this.tempUrl
        // 然后把地址发送给父组件的imagesPath[]
        // this.$emit('update-cover', this.tempUrl)
        const arr = this.sendfatherArr
        const uploadSuccess = true
        this.$emit('upload-success', {
          arr,
          uploadSuccess
        })
        this.sendfatherArr = []
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
</style>
