<template>
  <div>
    <msg v-if="isShowMsg" title="用户未登录" description="未登录用户不允许访问该页面，请先登录。" icon="warn" :buttons="buttons"></msg>
  </div>
</template>

<script>
import {Msg} from 'vux';
export default {
  name: 'logout',
  data() {
    return {
      isShowMsg: false,
      buttons: [
        {
          type: 'primary',
          text: '跳转到登录页面',
          link: '/login'
        }
      ]
    };
  },
  components: {
    Msg
  },
  created: function() {
    // 若用户未登录，则不应该访问注销操作
    if (false == this.$store.state.isLogined) {
      this.isShowMsg = true;
      return;
    }
    // 实现注销操作
    // 1. 恢复vuex中数据为原始状态
    this.$store.commit('mutationLogout');
    // 2. 清空localStorage数据
    window.localStorage.clear();
    // 3. 页面跳转
    this.$router.push('/topiclist/all');
  }
}
</script>
