import { createRouter, createWebHistory } from 'vue-router';
import Login from '@/components/Login.vue';


const routes = [
    { path: '/', component: Login , name: 'root'},// 默认重定向到主页
    // { path: '/home', component: Home , name: 'home'},
    { path: '/login', component: Login , name: 'login'},

];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
