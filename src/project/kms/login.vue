<template>
  <div class="kms-login">
    <div class="login-from">
      <h3>用户登录 <span>USERS LOGIN</span></h3>
      <input class="login-input" type="text" @keyup.enter="checkInput" v-model="username" placeholder="用户名"/>
      <input class="login-input" type="password" @keyup.enter="checkInput" v-model="password" placeholder="密码"/>
      <p class="login-con">
        <span class="err" v-if="errMsg">{{errMsg}}</span>
        <button class="login-btn" @click="checkInput">登录</button>
      </p>
    </div>
  </div>
</template>

<script>
import { setStorage } from '@/lib/sessionStorage';

export default {
  name: 'login',
  data () {
    return {
      username: '',
      password: '',
      errMsg: '',
      users: [
        {username: 'admin', password: '123456'},
        {username: 'gongyueqiong', password: '123456'},
        {username: 'foton', password: '123456'}
      ]
    };
  },
  methods: {
    passCheck () {
      let bool = false;
      this.users.forEach(ele => {
        if (ele.username === this.username && ele.password === this.password) {
          bool = true;
        }
      });
      return bool;
    },
    checkInput () {
      if (this.username.trim() === '') {
        this.errMsg = '请输入用户名';
        return false;
      }
      if (this.password.trim() === '') {
        this.errMsg = '密码不能为空';
        return false;
      }
      if (this.passCheck()) {
        this.errMsg = '';
        setStorage('userInfo', this.username);
        this.$router.replace(this.$route.query.redirect || '/engine/index.html');
      } else {
        this.errMsg = '用户名或密码错误';
      }
    }
  }
};
</script>

<style scoped lang="scss">
  $bg: '~@/assets/img/kms/login-bg.jpg';
  .kms-login {
    overflow: hidden;
    position: relative;
    height: 100%;
    width: 100%;
    margin: 0;
    background: url($bg) center center no-repeat;
    background-size: cover;

    .login-from {
      position: absolute;
      left: 63%;
      top: 50%;
      transform: translateY(-50%);
      z-index: 5;
      padding-left: 48px;
      padding-top: 35px;
      width: 340px;
      height: 310px;
      background-color: rgba(78, 90, 132, .9);

      h3 {
        margin-bottom: 25px;
        color: #fff;
        font-size: 20px;

        span {
          margin-left: 10px;
          color: #ddd;
          font-size: 14px;
        }
      }
    }

    .login-input {
      margin-bottom: 17px;
      width: 240px;
      height: 38px;
      padding: 0 9px;
      border: none;
      outline: none;
      font-size: 14px;
      color: #fff;
      text-align: left;
      background-color: rgba(255, 255, 255, .25);
    }

    .login-con {
      position: relative;

      .err {
        position: absolute;
        left: 0;
        top: 0;
        color: #ff6159;
      }
    }

    .login-btn {
      display: inline-block;
      cursor: pointer;
      margin-top: 33px;
      width: 240px;
      height: 40px;
      text-align: center;
      line-height: 40px;
      font-size: 18px;
      color: #4c536c;
      background: #fff;
    }
  }

  input::-webkit-input-placeholder {
    color: rgba(255, 255, 255, .6);
  }

  input::-moz-placeholder { /* Mozilla Firefox 19+ */
    color: rgba(255, 255, 255, .6);
  }

  input:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
    color: rgba(255, 255, 255, .6);
  }

  input:-ms-input-placeholder { /* Internet Explorer 10-11 */
    color: rgba(255, 255, 255, .6);
  }
</style>
