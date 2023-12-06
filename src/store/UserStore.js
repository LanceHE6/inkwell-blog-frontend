import {defineStore} from "pinia";
// 保存管理员信息
export const UserStore = defineStore("user", {
    state :() =>{
        return {
            uid: "",
            nickname: "",
            account: "",
            userType: 0, // 0为普通用户， 1为管理员
            token: ""
        }
    },
    actions: {},
    getters: {}
})