<template>
  <div class="bg">
  <div class="signup-panel">
    <n-button size="large" type="primary" class="return-button" ghost @click="router.push('/')">返回首页</n-button>
    <n-card title="用户注册">
      <n-form :rules="rules" :model="user" ref="formRef">
        <n-form-item path="nickname" label="昵称">
          <n-input v-model:value="user.nickname" placeholder="请输入昵称"></n-input>
        </n-form-item>
        <n-form-item path="account" label="账号">
          <n-input v-model:value="user.account" placeholder="请输入账号"></n-input>
        </n-form-item>
        <n-form-item path="password" label="密码">
          <n-input v-model:value="user.password" type=password placeholder="密码"></n-input>
        </n-form-item>
        <n-form-item path="confirmPassword" label="确认密码">
          <n-input v-model:value="user.confirmPassword" type=password placeholder="确认密码"></n-input>
        </n-form-item>
      </n-form>
      <template #footer>
        <n-space vertical>
          <div class="text-button">
            <n-button text type="info" @click="redirectToLogin">已有账号？登录</n-button>
          </div>
          <div class="signup-button">
            <n-button @click="validateAndSignup" secondary round type="primary" size="large"  style="width: 100px">注册</n-button>
          </div>
        </n-space>

      </template>
    </n-card>
  </div>
  </div>
</template>

<script setup>
import {ref, reactive, inject, markRaw} from "vue";
import  {useRouter} from "vue-router";

const router = useRouter()
//注入获取axios
const axios = inject("axios")

const message = inject("message")

// 确认密码的校验函数
const confirmPasswordValidator = (rule, value, callback) => {
  if (value !== user.password) {
    callback(new Error("两次输入的密码不一致"));
  } else {
    callback();
  }
};
// 输入校验规则
let rules = {
  account:[
    {required: true, message: "请输入账号", trigger: "blur"},
    {min: 3, max: 12, message: "账号长度在3到12个字符", trigger: "blur"},
  ],
  password:[
    {required: true, message: "请输入密码", trigger: "blur"},
    {min: 6, max: 18, message: "密码长度在6到18个字符", trigger: "blur"},
  ],
  confirmPassword:[
    { required: true, trigger: "blur", validator: confirmPasswordValidator},
  ],
  nickname:[
    {required: true, message: "请输入昵称", trigger: "blur"},
    {min: 3, max: 8, message: "昵称长度在3到8个字符", trigger: "blur"},
  ],
}

const user = reactive({
  nickname: "",
  account: "",
  password: "",
  confirmPassword: "",
})

const formRef = ref(null)
const validateAndSignup = async () => {

  const valid = await formRef.value.validate()
  console.log(valid)
  //判断formRef表单验证是否全部通过
    if (!valid) {
      await signup()
    }
};

const signup = async () => {

  const requestBody = {
    account: user.account,
    password: user.password,
    nickname: user.nickname
  }
  console.log(requestBody)
  let result = await axios.post("/user/signup", requestBody)

  console.log(result.data)
  if (result.data.code === 200){
    console.log("注册成功")
    message.success("注册成功")

    setTimeout(() =>{
      redirectToLogin()
    }, 2000)

  }else {
    console.log("注册失败")
    message.error("注册失败\n" + result.data.message)
  }

}
  const redirectToLogin = () =>{
    router.push("/login")
}
</script>

<style src="../assets/css/login.css" scoped>

</style>