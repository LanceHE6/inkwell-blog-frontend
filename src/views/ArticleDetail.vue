<template>
  <div class="container">

    <n-button @click="back">返回</n-button>

    <!-- 标题 -->
    <n-h1>{{ articleInfo.title }}</n-h1>
    <n-h3>发表时间: {{ articleInfo.createTime }}</n-h3>
    <!-- 文章内容 -->
    <div class="blog-content">
      <!-- 文章内容已html解析 -->
      <div v-html="articleInfo.content"></div>
    </div>
    <n-card title="评论区">
      <n-space vertical>

        <div v-for="(comm, index) in comment.data">

          <n-card>
            #{{index + 1}}
            <n-space>
              <div>头像</div>
              <div>{{ comm.uid }}</div>
            </n-space>

            <n-space vertical>
              <n-card>
                {{comm.content}}
              </n-card>
              <div>{{ comm.time }}</div>
            </n-space>
            <template #footer v-if="userStore.userType === 1" >
              <n-button @click="deleteComment(comm.id)">删除</n-button>
            </template>
          </n-card>
        </div>

        <n-input
            v-model:value="commentData.comment"
            type="textarea"
            placeholder="留下 属于你的足迹 ..."
            maxlength="200"
            show-count clearable
        />

      </n-space>
      <template #footer>
        <n-button type="primary" @click="postComment">BiuBiu</n-button>
      </template>
    </n-card>


  </div>
</template>

<script setup>
import {ref, reactive, inject, onMounted, computed, renderSlot} from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {UserStore} from "@/store/UserStore";

const userStore = UserStore()

const router = useRouter()
const route = useRoute()
const articleInfo = ref({})
const axios = inject("axios")
const message = inject("message")

onMounted(() => {
  loadArticle()
  loadComment()
})

/**
 * 读取文章详情
 */
const loadArticle = async () => {
  let result = await axios.get("/article/detail?id=" + route.query.id)
  if (result.data.code === 200){
    const temp_data = result.data.data;
    // 把时间戳转换为年月日
    let d = new Date(parseInt(temp_data.createTime))
    temp_data.createTime = `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
    articleInfo.value = temp_data;
  }else {
    message.error("获取文章详情失败: " + result.data.message)
  }

}

const back = ()=>{
  router.push("/")
}

let comment = reactive({
  data: []
})
const loadComment = async () => {
  let result = await axios.get("/comment/list?id=" + route.query.id)

  if (result.data.code === 200){
    // 转换时间戳
    let tempData =  result.data.data
    for(let comm of tempData){
      comm.time = timestampToTime(comm.time)
    }
    comment.data = tempData
  }else {
    message.error("评论发表失败: " + result.data.message)
  }
}

const commentData = reactive({
  id: "", //  文章id
  uid: "", //  用户id
  comment: "", // 评论内容
})

const postComment = async () => {
  if (userStore.uid === ""){
    message.error("请先登录")
    await router.push("/login")
    return
  }
  if (commentData.comment === ""){
    message.error("评论内容不能为空")
    return
  }
  commentData.id = articleInfo.value.id
  commentData.uid = userStore.uid

  console.log(commentData)
  let result = await axios.post("/comment/post", commentData)
  if (result.data.code === 200){
    commentData.comment = ""
    message.success("评论发表成功")
    await loadComment()
  }else {
    message.error("评论发表失败: " + result.data.message)
  }
}

const timestampToTime = (timestamp) => {
  timestamp = timestamp ? timestamp : null;
  let date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
  let Y = date.getFullYear() + '-';
  let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
  let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
  let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
  let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
  return Y + M + D + h + m + s;
}
</script>

<style>
.blog-content img {
  max-width: 100% !important;
}
</style>

<style lang="scss" scoped>
.container {
  width: 1200px;
  margin: 0 auto;
}
</style>