<template>
  <div style="border: 1px solid #ccc; margin-top: 10px">
    <Toolbar
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
        :mode="mode"
        style="border-bottom: 1px solid #ccc"
    />
    <Editor
        :defaultConfig="editorConfig"
        :mode="mode"
        v-model="valueHtml"
        style="height: 100%; min-height: 400px"
        @onCreated="handleCreated"
        @onChange="handleChange"

    />
  </div>
</template>

<script setup>
import '@wangeditor/editor/dist/css/style.css';
import {Editor, Toolbar} from "@wangeditor/editor-for-vue";
import {inject, onBeforeUnmount, onMounted, ref, shallowRef} from "vue";

const serverUrl = inject("server_url")
// 编辑器实例，必须用 shallowRef，重要！
const editorRef = shallowRef();
// 去向上传视频功能
const toolbarConfig = { excludeKeys: ['uploadVideo']};
const editorConfig = { placeholder: '请输入内容...' };
editorConfig.MENU_CONF = {}
// 指定图片上传的服务端地址
editorConfig.MENU_CONF['uploadImage'] = {
  server: serverUrl + '/upload/image',
  fieldName: 'file',
  // 小于该值就插入 base64 格式（而不上传），默认为 0
  base64LimitSize: 5 * 1024 // 5kb
}
// 判断返回图片地址是否包含服务端地址
editorConfig.MENU_CONF['insertImage'] = {
  parseImageSrc: (src) => {
    if(src.indexOf('http') !== 0){
      return serverUrl + src
    }
    return src
  }
}


const mode = ref("default")

// 编辑器内容
const valueHtml = ref("")

const props = defineProps({
  modelValue:{
    type: String,
    default: ''
  }
})
// 定义emit事件外抛数据
const emit = defineEmits(["update:modelValue"])
let initFinished = false


// 组件销毁时，也及时销毁编辑器，重要！
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});
onMounted(() =>{
  setTimeout(() =>{
    //设置延时，在外抛数据前将父级页面的数据读进来
    valueHtml.value = props.modelValue
    initFinished = true
  }, 200)
})
// 编辑器回调函数
const handleCreated = (editor) => {
  console.log('created', editor);
  editorRef.value = editor; // 记录 editor 实例，重要！
};
// 监听编辑器内容变化将编辑器内容外抛到父级页面中
const handleChange = (editor) => {
  if  (initFinished) {
    emit('update:modelValue', valueHtml.value)
  }
};
</script>

<style scoped>

</style>