import { createApp } from 'vue';
import {router} from "./router/index";
import App from "@/App.vue";

import {createDiscreteApi} from "naive-ui";
import naive from "naive-ui";
import {createPinia} from "pinia";
import axios from "axios";

// 设置默认后端服务地址
axios.defaults.baseURL = "http://localhost:8080"

const {message, notification, dialog} = createDiscreteApi(["message", "notification", "dialog"])

/*
 *axios
 *pinia
 * sass
 * vue-router
 * naive-ui
 * wangeditor
 */

const app = createApp(App)

app.provide("axios", axios)
app.provide("message", message)
app.provide("notification", notification)
app.provide("dialog", dialog)

app.use(naive)
app.use(router)
app.use(createPinia())

app.mount('#app')