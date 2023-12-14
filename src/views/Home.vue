<template>
  <div class="head">
    <div class="nav">

        <div @click="homePage" style="font-size: 24px">首页</div>
        <div style="font-size: 24px">关于</div>

        <n-dropdown trigger="hover" :options="avatarOption" @select="handleSelect">
          <n-avatar
              round
              size="huge"
              :src=loadAvatar
          />
        </n-dropdown>

    </div>

    <div class="head-avatar">
      <n-avatar
          round
          :size="160"
          :src="server_url + '/static/images/avatar.jpg'"
      />
    </div>

    <div class="title">
      本当の声を響かせてよ
    </div>

  </div>

  <div class="bg">
    <div class="container">

      <n-divider />
      <n-space class="search">

        <div class="search-container">
          <n-input-group>
            <!--        下拉框选择分类-->
            <n-popselect @update:value="searchByCategory" v-model:value="selectedCategory" :options="categoryOptions" trigger="click">
              <n-button size="medium">{{categoryName || '全部'}}</n-button>
            </n-popselect>

            <n-input v-model:value="pageInfo.keyword" :style="{ width: '1080px'}" placeholder="请输入关键字"/>
            <n-button type="primary" @click="loadArticle(0)" style="background-color: rgba(44, 110, 231,1)"> 搜索 </n-button>
          </n-input-group>
        </div>


      </n-space>

      <div v-for="(blog, index) in articleListInfo" class="blog-list">

        <n-card :title="blog.title" @click="toDetail(blog)">
          <n-card>{{ blog.content }}</n-card>

          <template #footer>
            <n-space align="center">
              <div style="justify-self: end">发布时间：{{ blog.create_time }}</div>
            </n-space>
          </template>
        </n-card>

      </div>

      <n-pagination @update:page="loadArticle" v-model:page="pageInfo.page" :page-count="pageInfo.pageCount" />

      <n-divider />

    </div>
  </div>


</template>

<script setup>
import { ref, reactive, inject, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {UserStore} from "@/store/UserStore";

const userStore = UserStore()

// 路由
const router = useRouter()
const route = useRoute()

const message = inject("message")
const dialog = inject("dialog")
const axios = inject("axios")
const server_url = inject("server_url")

const userAvatarOption = [
    {
      label: '个人中心',
      key: 'userInfo',
    },
  {
      label: '退出登录',
      key: 'logout',
    }
  ]
const adminAvatarOption = [
  {
    label: '个人中心',
    key: 'userInfo',
  },
  {
    label: '管理后台',
    key: 'dashboard',
  },
  {
    label: '退出登录',
    key: 'logout',
  }
]
const notLoginAvatarOption = [
  {
    label: '登录',
    key: 'login',
  }
]

const avatarOption = computed(() => {
  if (userStore.uid === ""){
    return notLoginAvatarOption
  }else if (userStore.uid !== "" && userStore.userType === 0){
    return userAvatarOption
  }else if (userStore.uid !== "" && userStore.userType === 1){
    return adminAvatarOption
  }
})
const loadAvatar = computed(() => {
  if (userStore.avatar === ""){
    return "https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
  }
  return userStore.avatar
})
const handleSelect = (key) => {
  if (key === "logout"){
    userStore.logout()
  } else {
    router.push(key)
  }

}

// 选中的分类
const selectedCategory = ref(0)
// 分类选项
const categoryOptions = ref([])
// 文章列表
const articleListInfo = ref([])

// 查询和分页数据
const pageInfo = reactive({
  page: 1,
  pageSize: 4,
  pageCount: 0,
  count: 0,
  keyword: "",
  categoryId: "",
})

onMounted(() => {
  loadCategory();
  loadArticle()
})

/**
 * 获取博客列表
 */
const loadArticle = async (page = 0) => {
  if (page !== 0) {
    pageInfo.page = page;
  }
  let result = await axios.get(`/article/search?keyword=${pageInfo.keyword}&page=${pageInfo.page}&pageSize=${pageInfo.pageSize}&categoryId=${pageInfo.categoryId}`)
  let temp_rows = result.data.data.rows;
  // 处理获取的文章列表数据
  for (let row of temp_rows) {
    row.content += "..."
    // 把时间戳转换为年月日
    let d = new Date(parseInt(row.createTime))
    row.create_time = `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
  }
  articleListInfo.value = temp_rows;
  pageInfo.count = result.data.data.count;
  //计算分页大小
  pageInfo.pageCount = parseInt(pageInfo.count / pageInfo.pageSize) + (pageInfo.count % pageInfo.pageSize > 0 ? 1 : 0)
  console.log(result.data)
}
/**
 * computed获取分类列表的值
 */
const categoryName = computed(() => {
  //获取选中的分类
  let selectedOption = categoryOptions.value.find((option) => { return option.value === selectedCategory.value })
  //返回分类的名称
  return selectedOption ? selectedOption.label : ""
})

/**
 * 获取分类列表
 */
const loadCategory = async () => {
  let res = await axios.get("/category/list")
  categoryOptions.value = res.data.rows.map((item) => {
    return {
      label: item.name,
      value: item.id
    }
  })
  // 在首位加入全部选项
  categoryOptions.value.unshift({
    label: "全部",
    value: -1
  })

}

/**
 * 选中分类
 */
const searchByCategory = (categoryId)=>{
  pageInfo.categoryId = categoryId === -1 ? "" : categoryId;
  loadArticle()
}

//页面跳转
const toDetail = (blog)=>{
  router.push({path:"/detail",query:{id:blog.id}})
}

const homePage = () => {
  router.push("/home")
}

const dashboard = () => {
  router.push("/login")
}

</script>

<style src="../assets/css/home.css" scoped>

</style>