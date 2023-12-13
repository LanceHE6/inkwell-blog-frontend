<template>
  <div class="user-panel">
    <n-card>
      <n-space vertical class="container">
        <n-avatar
            round
            :size="100"
            :src=loadAvatar
        />
        <div>昵称： {{userStore.nickname}}</div>
        <div>UID： {{userStore.uid}}</div>
      </n-space>

    </n-card>
  </div>

</template>

<script setup>
import {UserStore} from "@/store/UserStore";
import {computed, onMounted} from "vue";

const userStore = UserStore()

onMounted(() =>{

})

const loadAvatar = computed(() => {
  if (userStore.avatar === ""){
    return "https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
  }
  return userStore.avatar
})
</script>

<style scoped>
.user-panel{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 500px;
  height: 500px;
}
.container{
  position: fixed;
  top: 50%;
  left: 50%;
}
</style>