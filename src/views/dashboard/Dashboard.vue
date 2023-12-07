<template>

  <div class="title">Inkwell管理后台</div>

  <div class="main-panel">
    <div class="menus">
      <div v-for="(menu, index) in  menus" :key="index" @click="toPage(menu)">
        {{menu.name}}
      </div>
    </div>

    <div style="padding: 20px; width: 100%">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>

import {UserStore} from "@/store/UserStore";

import {ref, reactive, inject} from "vue";
import {useRouter} from "vue-router";

//注入获取axios
const axios = inject("axios")

const userStore = UserStore()
const router = useRouter()
const message = inject("message")

let menus = [
  {name: "首页", href: "/homepage"},
  {name: "文章管理", href: "/dashboard/article"},
  {name: "分类管理", href: "/dashboard/category"},
  {name: "退出登录", href: "logout"},
]

const toPage = (menu) => {
  if(menu.href === "logout"){
    router.push("/login")
  }else {
    router.push(menu.href)
  }
}

</script>

<style scoped>
.main-panel{
  display: flex;
  color: #64676a;
  max-width: 1500px;
  margin: 0 auto;
}
.menus{
  padding: 20px 0;
  box-sizing: border-box;
  line-height: 55px;
  text-align: center;
  width: 180px;
  height: 95vh;
  border-right: 1px solid #e5e5e5;
}
.menus div{
  cursor: pointer;
  &:hover{
    color: #3a84ff;;
  }
}
.title{
  font-size: 65px;
  font-weight: bold;
  text-align: right;
  position: fixed;
  color: rgba(0, 0, 0, 0.2);
  bottom: 20px;
}
</style>