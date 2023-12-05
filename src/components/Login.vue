<template>
  <div class="login-panel">
    <n-card title="用户登录">
     <n-form :rules="rules" :model="user">
       <n-form-item path="account" label="账号">
         <n-input v-model:value="user.userId" placeholder="账号"></n-input>
       </n-form-item>
       <n-form-item path="password" label="密码">
         <n-input v-model:value="user.password" type=password placeholder="密码"></n-input>
       </n-form-item>
     </n-form>
      <template #footer>
        <n-checkbox v-model:checked="user.remember" label="记住我"></n-checkbox>
        <n-button @click="login">登录</n-button>
      </template>
    </n-card>
  </div>
</template>

<script setup>
  import {ref, reactive, inject} from "vue";
  import {UserStore} from "@/store/UserStore";

  //注入获取axios
  const axios = inject("axios")

  const userStore = UserStore()
  const message = inject("message")

  // 输入校验规则
  let rules = {
      userId:[
        {required: true, message: "请输入账号", trigger: "blur"},
        {min: 3, max: 12, message: "账号长度在3到12个字符", trigger: "blur"},
      ],
      password:[
        {required: true, message: "请输入密码", trigger: "blur"},
        {min: 6, max: 18, message: "密码长度在6到18个字符", trigger: "blur"},
      ],
    }

  const user = reactive({
    userId: "",
    password: "",
    remember: false
  })

  const login = async () => {
    let result = await axios.post("/login", {
      userId: user.userId,
      password: user.password
    })
    console.log(result)
    if (result.code === 200){
      console.log("登录成功")
      // 需要将返回的数据存入Store中
      userStore.nickName = ""
      // ....token userId

      message.success("登录成功")
    }else {
      console.log("登录失败")
      message.error("账号或密码错误")
    }

  }
</script>

<style src="../assets/css/Login.css">

</style>