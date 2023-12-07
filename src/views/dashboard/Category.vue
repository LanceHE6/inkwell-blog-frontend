<template>
  <div>
    <n-button @click="showAddModal=true">添加分类</n-button>
      <n-table :bordered="false" :single-line="false">

        <thead>
        <tr>
          <th>编号</th>
          <th>名称</th>
          <th>操作</th>
        </tr>
        </thead>

        <tbody>
        <tr v-for="(category, index) in categoryList">
          <td>{{ category.id }}</td>
          <td>{{ category.name }}</td>
          <td>
            <n-space>
              <n-button @click="toUpdate(category)">修改</n-button>
              <n-button @click="del(category)">删除</n-button>
            </n-space>
          </td>
        </tr>
        </tbody>

      </n-table>

    <n-modal v-model:show="showAddModal">
      <n-card
          style="width: 600px"
          title="添加新分类"
          :bordered="false"
          size="huge"
          role="dialog"
          aria-modal="true"
      >
        <n-input v-model:value="addCategory.name" type=text placeholder="分类名称"></n-input>
        <template #footer>
          <n-button @click="add">提交</n-button>
        </template>
      </n-card>
    </n-modal>

    <n-modal v-model:show="showUpdateModal">
      <n-card
          style="width: 600px"
          title="修改分类"
          :bordered="false"
          size="huge"
          role="dialog"
          aria-modal="true"
      >
        <n-input v-model:value="updateCategory.name" type=text placeholder="分类名称"></n-input>
        <template #footer>
          <n-button @click="update">提交</n-button>
        </template>
      </n-card>
    </n-modal>

  </div>
</template>

<script setup>
import {ref, reactive, inject, onMounted} from "vue";
import {UserStore} from "@/store/UserStore";
import {useRouter} from "vue-router";

//注入获取axios
const axios = inject("axios")

const userStore = UserStore()
const router = useRouter()
const message = inject("message")
const dialog = inject("dialog")

onMounted(() =>{
  loadData()
})

const categoryList =  ref([])
// 模态框显示状态
const showAddModal = ref(false)
const showUpdateModal = ref(false)

const addCategory = reactive({
  name: ""
})
const updateCategory = reactive({
  id: "",
  name: ""
})

// 加载/更新数据
const loadData = async () => {
  let result = await axios.get("/category/list")
  console.log(result.data)
  if (result.data.code === 200){
    console.log("请求成功")
    console.log(result.data.rows)
    categoryList.value = result.data.rows
  }else {
    console.log("请求失败")
  }
}
// 添加分类
const add = async () => {
  const requestBody = {
    name: addCategory.name
  }
  let result = await axios.post("/category/add", requestBody)
  console.log(userStore.token)
  if (result.data.code === 200){
    console.log("请求成功")
    message.success("添加成功")
    showAddModal.value = false
    await loadData()
  } else {
    message.error("添加失败 " + result.data.message)
    console.log(result.data.message)
  }
}

// 删除分类
const del = async (category) => {
  dialog.warning({
    title: '删除分类',
    content: '确定删除分类:'+ category.name + '?',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      const requestBody = {
        id: category.id
      }
      //TODO 完善分类删除请求
      let result = await axios.post("/category/del", requestBody)

      if (result.data.code === 200){
        console.log("请求成功")
        message.success("删除成功")

        await loadData()
      } else {
        message.error("删除失败 " + result.data.message)
        console.log(result.data.message)
      }
    },
    onNegativeClick: () => {

    }
  })
}

// 指定更新分类目标
const toUpdate = async (category) => {
  showUpdateModal.value = true
  updateCategory.name = category.name
  updateCategory.id = category.id
}

// 更新分类
const update = async () => {
  const requestBody = {
    id: updateCategory.id,
    name: updateCategory.name
  }
  let result = await axios.post("/category/update", requestBody)
  console.log(requestBody)
  console.log(userStore.token)
  if (result.data.code === 200){
    console.log("请求成功")
    message.success("更新成功")
    showUpdateModal.value = false
    await loadData()
  } else {
    message.error("更新失败 " + result.data.message)
    console.log(result.data.message)
  }
}

</script>

<style scoped>

</style>