<template>
  <div>
    <h5>用户登录</h5>
    <group>
      <x-input placeholder="Access Token" v-model="accesstoken"></x-input>
    </group>
    <div style="height: 10px;"></div>
    <x-button type="primary" @click.native="dologin">登录</x-button>
    <toast type="text" v-model="isShowToast">{{toastText}}</toast>
  </div>
</template>

<script>
import {Group, XInput, XButton, Toast} from 'vux';
import {mapMutations} from 'vuex';
export default {
  name: 'login',
  components: {
    Group,
    XInput,
    XButton,
    Toast
  },
  data: function() {
    return {
      accesstoken: '',
      isShowToast: false,
      toastText: ''
    };
  },
  methods: {
    ...mapMutations(['mutationLogin', 'mutationLoginname', 'mutationAccessToken', 'mutationAuthorId']),
    // 执行用户登录操作
    dologin: function() {
      var app = this;
      this.$http.post('/accesstoken', {
        accesstoken: this.accesstoken
      }).then(function(response) { // 请求成功后的响应
        // 登录后：修改vuex中的登录状态，实现页面跳转（用户中心）
        // vuex中的数据是保存在内存中，当前应用程序生命周期结束时，vuex中的数据就会丢失
        // 用户持久化登录：本地存储，localStorage 或 sessionStorage
        if (response && response.data && response.data.success) {
          // 保存数据到vuex
          app.mutationLogin();
          app.mutationLoginname(response.data.loginname);
          app.mutationAccessToken(app.accesstoken);
          app.mutationAuthorId(response.data.id);
          // 保存登录数据到localStorage中
          window.localStorage.setItem('loginStatus', true);
          window.localStorage.setItem('loginname', response.data.loginname);
          window.localStorage.setItem('accesstoken', app.accesstoken);
          window.localStorage.setItem('author_id', response.data.id);
          // 页面跳转
          app.$router.push('/user/' + response.data.loginname);
        }
      }).catch(function(error) {
        // 请求失败时，会在catch块中处理错误
        // console.log(error.response);
        // 显示toast消息
        app.isShowToast = true;
        app.toastText = error.response.data.error_msg;
      });
    }
  }
}
</script>
