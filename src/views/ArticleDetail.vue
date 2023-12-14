<template>
  <div class="bg">
    <div class="container">
      <div class="button-container">
        <n-button @click="back" type="primary">返回</n-button>
      </div>
      <!-- 标题 -->
      <n-h1>{{ articleInfo.title }}</n-h1>
      <n-h3>发表时间: {{ articleInfo.createTime }}</n-h3>
      <!-- 文章内容 -->
      <div class="blog-content">
        <!-- 文章内容已html解析 -->
        <div v-html="articleInfo.content"></div>
      </div>
      <div class="comment">
        <n-card title="评论区">
          <n-space vertical>

            <div v-for="(comm, index) in comment.data">

              <n-card>
                #{{index + 1}}
                <n-space>
                  <n-avatar
                      round
                      size="large"
                      :src=comm.userAvatar
                  />
                  <div>{{ comm.userNickname }}</div>
                </n-space>

                <n-space vertical>
                  <n-card>
                    <div class="comment-content">
                      {{comm.content}}
                    </div>
                  </n-card>
                  <div>{{ comm.time }}</div>
                </n-space>
                <template #footer v-if="userStore.userType === 1" >
                  <div class="button-container">
                    <n-button @click="deleteComment(comm.cid)" type="error">删除</n-button>
                  </div>
                </template>
              </n-card>
            </div>

            <n-input
                v-model:value="postCommentData.comment"
                type="textarea"
                placeholder="留下 属于你的足迹 ..."
                maxlength="200"
                show-count clearable
            />

          </n-space>
          <template #footer>
            <div class="button-container">
              <n-button type="primary" @click="postComment">BiuBiu</n-button>
            </div>
          </template>
        </n-card>
      </div>

    </div>
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
    // 处理评论信息
    let tempData =  result.data.data
    for(let comm of tempData){
      comm.time = timestampToTime(comm.time) //转换时间戳
      // 获取用户信息
      let userData = await axios.get("/user/info?uid=" + comm.uid)
      console.log(userData.data)
      comm.userNickname = userData.data.data.nickname
      comm.userAvatar = userData.data.data.avatar
    }
    comment.data = tempData
  }else {
    message.error("评论发表失败: " + result.data.message)
  }
}
const deleteComment = async (cid) => {
  let result = await axios.post("/comment/delete", {
    id: route.query.id,
    cid: cid
  })
  if (result.data.code === 200){
    message.success("删除评论成功")
    await loadComment()
  }else {
    message.error("删除评论失败: " + result.data.message)
  }
}

const postCommentData = reactive({
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
  if (postCommentData.comment === ""){
    message.error("评论内容不能为空")
    return
  }
  postCommentData.id = articleInfo.value.id
  postCommentData.uid = userStore.uid

  console.log(postCommentData)
  let result = await axios.post("/comment/post", postCommentData)
  if (result.data.code === 200){
    postCommentData.comment = ""
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

<style scoped src="../assets/css/article_detail.css">

</style >