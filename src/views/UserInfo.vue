<template>
  <body>
  <div id="box">

    <div class="avatar">
      <n-avatar
          round
          :size="120"
          :src="loadAvatar"
      />
    </div>

    <div id="uid">UID {{userStore.uid}}</div>
    <div id="nickname">
      昵称 {{userStore.nickname}}
    </div>
    <n-space>
      <n-upload
          :action="server_url+'/upload/avatar'"
          :show-file-list="false"
          :data="{uid:userStore.uid}"
          accept=".png,.jpg"
          :on-finish="loadUserInfo"
      >
        <n-button>上传头像</n-button>
      </n-upload>
      <n-button class="set-nickname" @click="showSetNicknameModal = true" type="info">修改昵称</n-button>
      <n-button class="set-password" @click="showSetPasswordModal = true" type="info">修改密码</n-button>
      <n-button class="return-button" type="primary" @click="router.push('/')">返回首页</n-button>
    </n-space>

<!--    修改昵称-->
    <n-modal v-model:show="showSetNicknameModal">
      <n-card
          style="width: 600px"
          title="修改昵称"
          :bordered="false"
          size="huge"
          role="dialog"
          aria-modal="true"
      >
        <n-input v-model:value="setData.nickname" type=text placeholder="昵称"></n-input>
        <template #footer>
          <n-button @click="setNickname">提交</n-button>
        </template>
      </n-card>
    </n-modal>

    <n-modal v-model:show="showSetPasswordModal">
      <n-card
          style="width: 600px"
          title="修改密码"
          :bordered="false"
          size="huge"
          role="dialog"
          aria-modal="true"
      >
        <n-form :rules="rules" :model="setData" ref="formRef">
          <n-form-item label="旧密码" path="oldPassword">
            <n-input v-model:value="setData.oldPassword" type=password placeholder="旧密码"></n-input>
          </n-form-item>
          <n-form-item label="新密码" path="newPassword">
            <n-input v-model:value="setData.newPassword" type=password placeholder="新密码"></n-input>
          </n-form-item>
          <n-form-item label="确认密码" path="confirmPassword">
            <n-input v-model:value="setData.confirmPassword" type=password placeholder="确认密码"></n-input>
          </n-form-item>
        </n-form>

        <template #footer>
          <n-button @click="setPassword">提交</n-button>
        </template>
      </n-card>
    </n-modal>

  </div>
  </body>

</template>

<script setup>
import {UserStore} from "@/store/UserStore";
import {computed, inject, onMounted, reactive, ref} from "vue";
import axios from "axios";
import {router} from "@/router";
// import { UploadInst, UploadCustomRequestOptions } from "naive-ui";

const userStore = UserStore()
const server_url = inject("server_url")
const message = inject("message")

onMounted(() =>{

})
// 修改数据集
const setData = reactive({
  nickname:"",
  newPassword:"",
  oldPassword:"",
  confirmPassword:"",
})
// 修改密码校验器
const confirmPasswordValidator = (rule, value, callback) => {
  if (value !== setData.newPassword) {
    callback(new Error("两次输入的密码不一致"));
  } else {
    callback();
  }
};
// 修改密码表单校验规则
const rules = {
  oldPassword:[
    {required: true, message: "请输入旧密码", trigger: "blur"},
    {min: 6, max: 18, message: "密码长度在6到18个字符", trigger: "blur"},
  ],
  newPassword:[
    {required: true, message: "请输入新密码", trigger: "blur"},
    {min: 6, max: 18, message: "密码长度在6到18个字符", trigger: "blur"},
  ],
  confirmPassword:[
    { required: true, trigger: "blur", validator: confirmPasswordValidator},
  ],
}
// 加载头像
const loadAvatar = computed(() => {
  if (userStore.avatar === ""){
    return "https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
  }
  return userStore.avatar
})

let showSetNicknameModal = ref(false)
let showSetPasswordModal = ref(false)
const formRef = ref(null)


// const uploadAvatar = (file) =>{
//   let reader = new FileReader();
//   reader.readAsDataURL(file.file);
//   console.log(file)
//   // let imgBase = {} as IImgBase;
//   // // 读取图片是异步方法，成功读取后会执行里面的内容
//   // reader.onload = function (e) {
//   //   imgBase.imgBase64 = e.target?.result?.split(",")[1]; // 这就是个普通字符串
//   //   // 后端接口
//   //   UpladImage(imgBase).then((data) => {
//   //     // 后端返回的是base64位数据，需要按下面格式显示
//   //     newImg.value = "data:image/png;base64," + data.data;
//   //   });
//   // };
// }
// 修改昵称
const setNickname = async () => {
  let result = await axios.post("/user/set_nickname", {
    uid: userStore.uid,
    nickname: setData.nickname
  })
  if (result.data.code === 200){
    message.success("昵称修改成功")
    showSetNicknameModal.value = false
    await loadUserInfo()
  } else {
    message.error("昵称修改失败:" + result.data.message)
  }
}

// 修改密码
const setPassword = async () => {
  const valid = await formRef.value.validate()
  //判断formRef表单验证是否全部通过
  if (!valid) {
    let result = await axios.post("/user/set_password", {
      uid: userStore.uid,
      oldPassword: setData.oldPassword,
      newPassword: setData.newPassword,
    })
    if (result.data.code === 200){
      message.success("密码修改成功")
      showSetPasswordModal.value = false
      await loadUserInfo()
    } else if(result.data.code === -1) {
      message.error("密码错误")
    } else {
      message.error("密码修改失败:" + result.data.message)
    }
  } else {
    message.error("请填写完整信息")
  }
}
//  加载用户数据
const loadUserInfo = async () => {
  let result = await axios.get("/user/info?uid="+ userStore.uid)
  if (result.data.code === 200){
    userStore.nickname = result.data.data.nickname
    userStore.avatar = result.data.data.avatar
  }
}
</script>

<style scoped src="../assets/css/user_info.css">

</style>