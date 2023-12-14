<template>
  <n-card style="margin-bottom: 16px">
    <n-tabs v-model:value="tableValue" justify-content="start" type="line">
      <n-tab-pane name="list" tab="文章列表">

        <div v-for="(article, index) in articleList.value">
          <n-card :title="article.title" style="margin-bottom: 15px">
            {{article.content}}
            <template #footer>
              <n-space align="center">
                <div>发布时间: {{article.createTime}}</div>
                <div style="margin-left: 650px">
                  <n-button @click="toUpdate(article)" type="info">修改</n-button>
                </div>
                <div>
                  <n-button @click="del(article)" type="error">删除</n-button>
                </div>

              </n-space>
            </template>
          </n-card>
        </div>
<!--        分页-->
        <n-space>
          <div v-for="page in pageInfo.pageCount" @click="toPage(page)">
            <div :style="'color:' + (page===pageInfo.page ? 'blue' : '')">
              {{page}}
            </div>
          </div>
        </n-space>

      </n-tab-pane>

      <n-tab-pane name="add" tab="发表文章">
        <n-form>

          <n-form-item label="标题">
            <n-input v-model:value="addArticle.title" placeholder="请输入标题"/>
          </n-form-item>
          <n-form-item label="分类">
            <n-select v-model:value="addArticle.categoryId" :options="categoryOptions"/>
          </n-form-item>
          <n-form-item label="内容">
            <rich-text-editor v-model="addArticle.content"></rich-text-editor>
          </n-form-item>
          <n-form-item label="">
            <n-button type="primary" @click="add">提交</n-button>
          </n-form-item>

        </n-form>
      </n-tab-pane>

      <n-tab-pane name="update" tab="修改文章">
        <n-form>

          <n-form-item label="标题">
            <n-input v-model:value="updateArticle.title" placeholder="请输入标题"/>
          </n-form-item>
          <n-form-item label="分类">
            <n-select v-model:value="updateArticle.categoryId" :options="categoryOptions"/>
          </n-form-item>
          <n-form-item label="内容">
            <rich-text-editor v-model="updateArticle.content"></rich-text-editor>
          </n-form-item>
          <n-form-item label="">
            <n-button type="primary" @click="update">提交</n-button>
          </n-form-item>

        </n-form>
      </n-tab-pane>
    </n-tabs>
  </n-card>

</template>

<script setup>
import {ref, reactive, inject, onMounted} from "vue";
import {useRouter} from "vue-router";
import RichTextEditor from "@/components/RichTextEditor.vue";

//注入获取axios
const axios = inject("axios")

const router = useRouter()
const message = inject("message")
const loadingBar = inject("loadingBar")
const dialog = inject("dialog")
let tableValue = ref("list")

const addArticle = reactive({
  title: "",
  content: "",
  categoryId: "",
})

const updateArticle = reactive({
  id: "",
  title: "",
  content: "",
  categoryId: "",
})
const toUpdate = async (article)=>{
  tableValue.value = "update"
  let result = await axios.get(`/article/detail?id=${article.id}`)
  console.log(result.data)
  if (result.data.code === 200){
    updateArticle.id = result.data.data.id
    updateArticle.title = result.data.data.title
    updateArticle.content = result.data.data.content
    updateArticle.categoryId = result.data.data.categoryId

  } else {
    message.error("获取文章详情失败:"+result.data.message)
  }
}

const update = async () =>{
  loadingBar.start()
  let result = await axios.post(`/article/update`, updateArticle)
  console.log(result.data)
  if (result.data.code === 200){
    

    updateArticle.id = ""
    updateArticle.categoryId = ""
    updateArticle.content = ""
    updateArticle.title = ""
    tableValue.value = "list"
    await loadArticle()
    loadingBar.finish()
    message.success("文章更新成功")
  } else {
    loadingBar.error()
    message.error("文章更新失败:"+result.data.message)
  }
}


onMounted(() =>{
  loadArticle()
  // 挂载页面时加载分类项
  loadCategory()
})

const pageInfo = reactive({
  page: 1,
  pageSize:10,
  pageCount: 0, // 页码总数
  count: 0, // 文章总数
})
let articleList = reactive([])
const loadArticle = async () => {
  loadingBar.start()
  let result = await axios.get(`/article/search?page=${pageInfo.page}&pageSize=${[pageInfo.pageSize]}`)
  console.log(result.data)
  if (result.data.code === 200){
    
    let temp_rows = result.data.data.rows
    for (let row of temp_rows){
      row.content += " ..." // 内容加上省略号
      row.createTime = timestampToTime(parseInt(row.createTime)) // 转换时间戳
    }
    articleList.value = temp_rows
    pageInfo.count = result.data.data.count
    pageInfo.pageCount = Math.ceil(pageInfo.count / pageInfo.pageSize)
    console.log(articleList.value)
    console.log(pageInfo)
    loadingBar.finish()
  } else {
    loadingBar.error()
    message.error("加载文章列表失败:"+result.data.message)
  }
}

const categoryOptions = ref([])
const loadCategory = async () => {
  let result = await axios.get("/category/list")
  if (result.data.code === 200){
    
    // 设置选项框值
    categoryOptions.value = result.data.rows.map((item) =>{
      return {
        label: item.name,
        value: item.id
      }
    })
  }else {
    console.log("请求失败" +  result.data.message)
  }
}

const add = async () => {
  if (addArticle.title === ""){
    message.warning("请输入标题")
    return
  }
  if (addArticle.categoryId === ""){
    message.warning("请选择分类")
    return
  }
  if (addArticle.content === "<p><br></p>"){
    message.warning("请输入文章内容")
    return
  }
  let result = await axios.post("/article/add", addArticle)
  if (result.data.code === 200){
    
    console.log(result.data.message)
    message.success("添加成功")
    addArticle.categoryId = ""
    addArticle.title = ""
    addArticle.content = ""
    await loadArticle()
  }else {
    console.log("请求失败" +  result.data.message)
    message.error("添加成功 " + result.data.message)
  }
}


/* 时间戳转换为时间 */
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

const toPage = (page) => {
  pageInfo.page = page
  loadArticle()
}
const del = async (article) => {
  dialog.warning({
    title: '删除文章',
    content: '确定删除文章:'+ article.title + '?',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      let result = await axios.post("/article/delete", {id: article.id})
      console.log(result.data)
      if (result.data.code === 200){
        
        message.success("删除成功")
        await loadArticle()
      } else {
        console.log("请求失败" +  result.data.message)
        message.error("删除成功 " + result.data.message)
      }
    },
    onNegativeClick: () => {
    }
  })
}
</script>

<style scoped>

</style>