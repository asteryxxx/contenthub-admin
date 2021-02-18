<template>
  <!-- el-form表单组件，每个表单项都必须使用el-form-item组件包裹 -->
  <div class="login-container">
    <!-- 配置form表单验证：
    1、必须给el-form组件绑定model为表单数据对象
    2、给需要验证的表单项绑定props属性
    3、通过el-from组件的rules属性配置验证规则
    -->
    <el-form :model="user" ref="loginForm" :rules="rules" class="login-form">
      <div class="login-head"></div>
      <el-form-item prop="name">
        <el-input
         v-model="user.name"
         placeholder="请输入账号"
        ></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
         v-model="user.password"
         placeholder="请输入密码"
        ></el-input>
      </el-form-item>
      <el-form-item prop="agree">
        <el-checkbox v-model="user.agree">我已经阅读并同意用户协议</el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-button
          :loading="btnloading"
          type="primary"
          @click="onLogin('loginForm')"
          class="login-btn"
        >登陆</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { login } from '@/api/user'
export default {
  name: 'LoginIndex',
  data () {
    return {
      btnloading: false,
      // 登陆的loading状态
      user: {
        name: 'zjt',
        password: '123456',
        agree: false // 必须要放在user表单里面，这个是否点击
      },
      rules: {
      // 表单验证的规则配置
        name: [
          { required: true, message: '账号不能为空', trigger: 'change' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'change' },
          { pattern: /^[a-zA-Z0-9]{3,10}$/, message: '输入正确的密码格式', trigger: 'change' }
        ],
        agree: [
          {
            // 自定义校验规则
            // 验证通过： callback()
            // 验证失败： callback(new Error('Xxxx'))
            validator: (rule, value, callback) => {
              if (value) {
                callback()
              } else {
                callback(new Error('请勾选同意协议'))
              }
            },
            trigger: 'change'
          }
        ]
      }
    }
  },
  /* 手动触发表单验证：
  1、给el-form设置ref起个名字
  2、通过ref获取el-form组件 */
  methods: {
    async onLogin (formName) {
      // 获取表单数据
      // 表单验证
      this.$refs[formName].validate(valid => {
        if (!valid) {
          // valid是布尔值，验证是否通过
          console.log('error submit!!')
          return false
        }
        // 验证通过
        this.loginMain()
      })
    },
    loginMain () {
      // 验证通过，提交登陆
      this.btnloading = true
      login(this.user).then(res => {
        this.$message({
          showClose: true,
          message: '恭喜你登陆成功~',
          type: 'success'
        })
        this.btnloading = false
        // 把用户信息存储到本地存储,转为json格式字符串
        localStorage.setItem('user', JSON.stringify(res.data.data))
        // 跳转到首页
        this.$router.push({
          name: 'home'
        })
      }).catch(error => {
      // 【axios请求失败，如何获取接口返回的状态码及错误信息？】
      // https://blog.csdn.net/pinbolei/article/details/106854596
      // 这里要解构error才能取到request和response返回的错误消息
      // console.log(error.response.data);
      // console.log(error.response.status);
      // console.log(error.response.headers);
        const tt = { ...error }
        const message = tt.response.data
        this.$message.error(message)
        this.btnloading = false
      // 防止网络请求慢出现用户多次点击触发登陆请求
      })
    }
  }
}
</script>

<style scoped lang='less'>
.login-container{
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: url("./loginBg.jpg") no-repeat;
  background-size: cover;
  /* cover保持原有比例填充满 */
  .el-form {
    background-color: #fff;
    padding: 50px;
    /* padding属性可以把内容周围撑起来 */
    min-width: 300px;
  /* min-width该属性值会对元素的宽度设置一个最小限制 */
    .el-button {
      width: 100%;
    }
   .login-head {
     width: 320px;
     height: 100px;
     background: url('./login-head.png') no-repeat;
    }
  }
}

</style>
