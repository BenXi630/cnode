<template>
  <div id="app">
    <x-header  @on-click-title="routetohome">
      cnode移动端社区
      <div slot="right" @click="showMoreMenus">
        <a class="vux-header-more"></a>
        <badge
       v-if="badgeText" :text="badgeText" style="margin-left: 3px;"></badge>
      </div>
    </x-header>
    <router-view></router-view>
    <actionsheet :menus="moreMenus" v-model="isShowMoreMenus" @on-click-menu="handleClickMoreMenu"></actionsheet>
    <vm-back-top></vm-back-top>
  </div>
</template>

<script>
import { XHeader, Actionsheet, Badge } from 'vux';
import { mapState, mapGetters, mapMutations } from 'vuex';
import VmBackTop from 'vue-multiple-back-top';
export default {
  name: 'app',
  data: function() {
    return {
      badgeText: ''
    };
  },
  components: {
    XHeader,
    Actionsheet,
    VmBackTop,
    Badge
  },
  computed: {
    ...mapGetters(['moreMenus']),
    ...mapState(['topics', 'loginedMoreMenus', 'unLoginedMoreMenus', 'isLogined']),
    isShowMoreMenus: {
      get: function() {
        return this.$store.state.isShowMoreMenus;
      },
      set: function(nval) {
        // 触发mutation，从而修改状态数据
        this.$store.commit('mutationIsShowMoreMenus', nval);
      }
    }
  },
  // 当前组件创建成功以后回调函数
  created: function() {
    // 读取localStorage中的数据
    var loginStatus = window.localStorage.getItem('loginStatus');
    // 写入到vuex中
    if (loginStatus) {
      // 用户处理登录状态
      this.mutationLogin();
      this.mutationLoginname(window.localStorage.getItem('loginname'));
      this.mutationAccessToken(window.localStorage.getItem('accesstoken'));
      this.mutationAuthorId(window.localStorage.getItem('author_id'));
    }

    if (this.isLogined) {
      // ajax获取未读消息个数
      this.getUnreadMsgCount();
      // 采用定时操作来实现该业务
      var app = this;
      window.setInterval(function() {
        app.getUnreadMsgCount();
      }, 5*60*1000);
    }
  },
  methods: {
    // 获取服务器端未读消息个数
    getUnreadMsgCount: function() {
      var app = this;
      this.$http.get('/message/count', {
        params: {
          accesstoken: this.$store.state.accesstoken
        }
      }).then(function(response) {
        // 修改当前badgeText值
        if (response.data.success) {
          app.badgeText = response.data.data;
        }
      });
    },
    ...mapMutations(['mutationLogin', 'mutationLoginname', 'mutationAccessToken', 'mutationAuthorId']),
    // 跳转到主页
    routetohome: function() {
      this.$router.replace('/');
    },
    // 点击x-header右侧“更多”时，显示菜单（actionsheet）
    showMoreMenus() {
      // 显示actionsheet菜单
      // vuex中的状态数据不能被直接修改，只能使用mutations进行修改
      this.isShowMoreMenus = true;
    },
    // 点击actionsheet菜单时，触发的回调函数
    handleClickMoreMenu(menukey, menuitem) {
      // console.log('menukey = ' + menukey);
      // 实现路由跳转
      this.$router.push('/' + menukey);
    }
  }
}
</script>

<style lang="less">
@import '~vux/src/styles/reset.less';

body {
  background-color: #fbf9fe;
}
</style>
