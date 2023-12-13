import { createRouter, createWebHistory } from 'vue-router';
import Login from '@/views/Login.vue';
import Signup from "@/views/Signup.vue";
import Dashboard from "@/views/dashboard/Dashboard.vue";
import Category from "@/views/dashboard/Category.vue";
import Article from "@/views/dashboard/Article.vue";
import Home from "@/views/Home.vue";
import ArticleDetail from "@/views/ArticleDetail.vue";
import UserInfo from "@/views/UserInfo.vue";



const routes = [
    { path: '/', component: Home , name: 'homepage'},
    { path: '/home', component: Home , name: 'home'},
    { path: '/login', component: Login , name: 'login'},
    { path: '/signup', component: Signup , name: 'signup'},
    { path: '/detail', component: ArticleDetail , name: 'articleDetail'},
    { path: '/userInfo', component: UserInfo , name: 'userInfo'},
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
