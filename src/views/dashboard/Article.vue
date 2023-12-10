<template>
  <n-card style="margin-bottom: 16px">
    <n-tabs default-value="list" justify-content="start" type="line">
      <n-tab-pane name="list" tab="文章列表">

        <div v-for="(article, index) in articleList.value">
          <n-card :title="article.title" style="margin-bottom: 15px">
            {{article.content}}
            <template #footer>
              <n-space align="center">
                <div>发布时间: {{article.createTime}}</div>
                <n-button>修改</n-button>
                <n-button>删除</n-button>
              </n-space>
            </template>
          </n-card>
        </div>

        <n-space>
          <div v-for="page in pageInfo.pageCount" @click="toPage(page)">
            <div :style="'color:' + (page===pageInfo.page ? 'blue' : '')">
              {{page}}
            </div>
          </div>
        </n-space>

      </n-tab-pane>
      <n-tab-pane name="add" tab="添加文章">
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
      <n-tab-pane name="jay chou" tab="周杰伦">
        七里香
      </n-tab-pane>
    </n-tabs>
  </n-card>

</template>

<script setup>
import {ref, reactive, inject, onMounted} from "vue";
import {UserStore} from "@/store/UserStore";
import {useRouter} from "vue-router";
import RichTextEditor from "@/components/RichTextEditor.vue";
import {compileString} from "sass";

//注入获取axios
const axios = inject("axios")

const userStore = UserStore()
const router = useRouter()
const message = inject("message")
const dialog = inject("dialog")

const addArticle = reactive({
  title: "",
  content: "",
  categoryId: "",
})

onMounted(() =>{
  loadArticle()
  // 挂载页面时加载分类项
  loadCategory()
})

const pageInfo = reactive({
  page: 1,
  pageSize: 3,
  pageCount: 0, // 页码总数
  count: 0, // 文章总数
})
let articleList = reactive([])
const loadArticle = async () => {
  let result = await axios.get(`/article/search?page=${pageInfo.page}&pageSize=${[pageInfo.pageSize]}`)
  console.log(result.data)
  if (result.data.code === 200){
    console.log("请求成功")
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
  } else {
    message.error("加载文章列表失败:"+result.data.message)
  }
}

const categoryOptions = ref([])
const loadCategory = async () => {
  let result = await axios.get("/category/list")
  if (result.data.code === 200){
    console.log("请求成功")
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
  let result = await axios.post("/article/add", addArticle)
  if (result.data.code === 200){
    console.log("请求成功")
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
</script>

<style scoped>

</style>