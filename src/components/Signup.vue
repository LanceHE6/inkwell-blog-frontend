<template>
  <div class="signup-panel">
    <n-card title="用户注册">
      <n-form :rules="rules" :model="user">
        <n-form-item path="account" label="昵称">
          <n-input v-model:value="user.nickName" placeholder="请输入昵称"></n-input>
        </n-form-item>
        <n-form-item path="account" label="账号">
          <n-input v-model:value="user.account" placeholder="请输入账号"></n-input>
        </n-form-item>
        <n-form-item path="password" label="密码">
          <n-input v-model:value="user.password" type=password placeholder="密码"></n-input>
        </n-form-item>
      </n-form>
      <template #footer>
        <n-button @click="signup">注册</n-button>
      </template>
    </n-card>
  </div>
</template>

<script setup>
import {ref, reactive, inject} from "vue";

//注入获取axios
const axios = inject("axios")

const message = inject("message")

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
  nickName:[
    {required: true, message: "请输入昵称", trigger: "blur"},
    {min: 3, max: 8, message: "昵称长度在3到8个字符", trigger: "blur"},
  ],
}

const user = reactive({
  nickName: "",
  account: "",
  password: "",
  remember: false
})

const signup = async () => {
  let result = await axios.post("/signup", {
    nickName: user.nickName,
    account: user.account,
    password: user.password
  })
  console.log(result)
  if (result.code === 200){
    console.log("注册成功")
    // ....token userId

    message.success("注册成功")
  }else {
    console.log("注册失败")
    message.error("注册失败")
  }

}
</script>

<style src="../assets/css/Signup.css">

</style>