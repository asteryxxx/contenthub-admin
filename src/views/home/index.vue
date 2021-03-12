<template>
  <div class='home-container'>
   <!-- <el-upload
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
    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
  </el-upload> -->
  </div>
</template>
<script>
// import { uploadDraft } from '@/api/upload'
export default {
  name: 'homeIndex',
  data () {
    return {
    //   fileList: [
    //     { url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' },
    //     { url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' },
    //     { url: 'http://localhost:8888/users/1/avatar' } 
    //   ]
    }
  }
  /* methods: {
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
      console.log('------')
      console.log(fileList)// 文件数组剩余的图片
      this.fileList = fileList
    },
    // 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
    handleChange (file, fileList) {
      console.log('handlechange.....')
      console.log(file)
      // 可以拿到name和url，然后在raw可以拿到原生文件的参数例如name,size,type,uid
      console.log('------')
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
    }
  } */
  /* 当我上传图片的时候，先执行change事件，然后根据图片的数量
  他的list会产生变化，然后我们手动调用request方法，他就会去
  执行httpRequest方法，然后我们得到上传后的图片地址，然后
  添加到fileList里面即可 */
}
</script>
<style scoped lang='less'>
.home-container {
  background-image: url('./bg.jpg');
  height:560px
}
</style>
