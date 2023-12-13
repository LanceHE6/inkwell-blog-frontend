<template>
  <div class="login-panel">
    <n-card title="用户登录">
     <n-form :rules="rules" :model="user">
       <n-form-item path="account" label="账号">
         <n-input v-model:value="user.account" placeholder="账号"></n-input>
       </n-form-item>
       <n-form-item path="password" label="密码">
         <n-input v-model:value="user.password" type=password placeholder="密码"></n-input>
       </n-form-item>
     </n-form>
      <template #footer>
        <n-checkbox v-model:checked="user.remember" label="记住我"></n-checkbox>
        <n-button @click="login">登录</n-button>
        <n-button strong secondary type="info" @click="redirectToSignup">还没有账号？注册</n-button>
      </template>
    </n-card>
  </div>
</template>

<script setup>
  import {ref, reactive, inject} from "vue";
  import {UserStore} from "@/store/UserStore";
  import {useRouter} from "vue-router";

  //注入获取axios
  const axios = inject("axios")

  const userStore = UserStore()
  const router = useRouter()
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
    }

  const user = reactive({
    account: localStorage.getItem("account") || "",
    password: localStorage.getItem("password") || "",
    remember: localStorage.getItem("remember") === '1',
  })

  const login = async () => {
    let result = await axios.post("/user/login", {
      account: user.account,
      password: user.password
    })

    if (result.data.code === 200){
      console.log("登录成功")
      // 需要将返回的数据存入Store中
      // ....token userId
      userStore.uid = result.data.uid
      userStore.nickname = result.data.nickname
      userStore.account = result.data.account
      userStore.userType = result.data.userType
      userStore.token = result.data.token
      userStore.avatar = result.data.avatar
      localStorage.setItem("token", userStore.token)
      console.log(userStore.token)

      // 记住账号密码
      if (user.remember){
        localStorage.setItem("account", userStore.account)
        localStorage.setItem("password", user.password)
        localStorage.setItem("remember", user.remember ? '1': '0')
      }else {
        localStorage.setItem("account", "")
        localStorage.setItem("password", "")
        localStorage.setItem("remember", "")
      }

      message.success("登录成功")
      await router.push("/home")
    }else {
      console.log("登录失败")
      message.error("账号或密码错误")
    }

  }
  const redirectToSignup = () => {
    router.push("/signup")
  }
</script>

<style src="../assets/css/Login.css">

</style>