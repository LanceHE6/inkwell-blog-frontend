import { createRouter, createWebHistory } from 'vue-router';
import Login from '@/views/Login.vue';
import Signup from "@/views/Signup.vue";
import Dashboard from "@/views/dashboard/Dashboard.vue";
import Category from "@/views/dashboard/Category.vue";
import Article from "@/views/dashboard/Article.vue";


const routes = [
    //{ path: '/', component: Login , name: 'root'},// 默认重定向到主页
    // { path: '/home', component: Home , name: 'home'},
    { path: '/login', component: Login , name: 'login'},
    { path: '/signup', component: Signup , name: 'signup'},
    { path: '/dashboard', component: Dashboard , name: 'dashboard', children: [
            // 二级路由
            { path: '/dashboard/category', component: Category , name: 'category'},
            { path: '/dashboard/article', component: Article , name: 'article'},
        ]},

];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export {router, routes};
