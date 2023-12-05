
<script>
  import axios from "axios";
  import config from "/config";

  export default {
    data(){
      return{
        failFlag: false,
        uid: "",
        psw:"",
        responseJsonData:'',//存储请求返回的json数据
        tzNum:0,
        exchangeNum:0,
        lmCoin:0
      }
    },
    methods: {
      submitForm() {
        const that = this
        const loginData = {
          uid: this.uid,
          psw: this.psw
        };
        //设置传递参数格式
        axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
        axios.post(config.SERVER_URL+"/login", loginData)
            .then(response => {
              this.responseJsonData=response.data
              if (this.responseJsonData.msg === 'success') {

                this.failFlag=false
                this.tzNum=this.responseJsonData.num
                this.exchangeNum=this.responseJsonData.exchangeNum
                this.lmCoin=this.responseJsonData.lmc
                //把获取到的数据存入store中，跳转后方便userinfo显示数据
                that.$store.commit('setUserId', this.uid)
                that.$store.commit('setUserNum', this.tzNum)
                that.$store.commit('setUserLmc', this.lmCoin)
                that.$store.commit('setUserExchangeNum', this.exchangeNum)
                // 登录成功，使用路由跳转到指定URL
                that.$router.push('/userinfo')
                console.log("success")
              } else {
                // alert('用户名或密码错误'); //弹窗提示
                this.failFlag=true
              }
            })
            .catch(error => {
              console.error('Login request error:', error);
            });
      }
    }
  }
</script>

<template>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy"  />
    <title>Mizuki</title>
  </head>

  <head>
    <title>MizukiLogin</title>
  </head>
  <body>
  <div class="shell">
    <div id = "img-box">
      <img src="../assets/images/1.jpg" alt="">
    </div>
<!--    form表单 点击submit后执行submitForm-->
    <form @submit.prevent="submitForm">
      <div id="form-body">
        <div id="welcome-lines">
          <div id="w-line-1">Hi, Friends</div>
          <div id="w-line-2">Welcome to Mizuki</div>
        </div>
        <div id="input-area">
          <div :class="failFlag? 'f-inp-error':'f-inp'" >
            <input type="text" placeholder="QQ" v-model.lazy="uid" autofocus="autofocus">
          </div>
          <div class="f-inp">
            <input type="password" placeholder="Password QQ号后六位" v-model.lazy="psw">
          </div>
        </div>
        <div id="error-account">
          <p v-show="failFlag">账号或密码错误</p>
        </div>
        <div id="submit-button-cvr">
          <button id="submit-button"  type="submit" autofocus="autofocus">LOGIN</button>
        </div>
      </div>
    </form>
  </div>
  </body>
</template>

<style src="../assets/css/Login.css" scoped>

</style>