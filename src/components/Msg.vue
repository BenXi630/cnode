<template>
  <div>
    <div style="margin-top: 10px;">
      <button-tab v-model="selectedTabIndex">
        <button-tab-item>未读消息</button-tab-item>
        <button-tab-item>已读消息</button-tab-item>
      </button-tab>
    </div>
    <!-- 未读消息 -->
    <swipeout v-if="selectedTabIndex == 0">
      <swipeout-item v-for="(item, index) in hasNotReadMsgs" :key="index">
        <div slot="right-menu">
          <swipeout-button type="primary" @click.native="markRead(item.id)">标记为已读</swipeout-button>
        </div>
        <div slot="content">
          <span slot="title">
            <a :href="'/#/user/' + item.author.loginname">{{item.author.loginname}}</a>
            回复了您的话题
            <a :href="'/#/topic/' + item.topic.id">{{item.topic.title}}</a>
          </span>
        </div>
      </swipeout-item>
      <a v-if="hasNotReadMsgs && hasNotReadMsgs.length > 0" href="#" @click.prevent="markAll">全部标记为已读</a>
      <span v-else>暂无未读消息</span>
    </swipeout>
    <group v-if="selectedTabIndex == 1">
      <cell v-for="(item, index) in hasReadMsgs" :key="index">
        <span slot="title">
          <a :href="'/#/user/' + item.author.loginname">{{item.author.loginname}}</a>
          回复了您的话题
          <a :href="'/#/topic/' + item.topic.id">{{item.topic.title}}</a>
        </span>
      </cell>
    </group>
  </div>
</template>

<script>
import {ButtonTab, ButtonTabItem, Group, Cell, Swipeout, SwipeoutItem, SwipeoutButton} from 'vux';
export default {
  name: 'msg',
  data: function() {
    return {
      selectedTabIndex: 0,
      hasReadMsgs: null,
      hasNotReadMsgs: null
    };
  },
  methods: {
    // 标记所有消息为已读
    markAll: function() {
      var app = this;
      this.$http.post('/message/mark_all', {
        accesstoken: this.$store.state.accesstoken
      }).then(function(response) {
        if (response.data && response.data.success) {
          // 标记为已读操作是完成了
          console.log("已经全部标记为已读");
          // ajax后续处理
          // 模拟实现路由刷新
          app.$router.go(0);
        }
      });
    },
    // 标记指定消息为已读
    markRead: function(mid) {
      // console.log('mid = ' + mid);
      var app = this;
      this.$http.post('/message/mark_one/' + mid, {
        accesstoken: this.$store.state.accesstoken
      }).then(function(response) {
        if (response.data && response.data.success) {
          // 标记为已读操作是完成了
          console.log("已经标记为已读");
          // ajax后续处理
          // 在未读消息列表中删除当前记录
          // 把当前记录添加到已读消息列表中
        }
      });
    }
  },
  components: {
    ButtonTab,
    ButtonTabItem,
    Group,
    Cell,
    Swipeout,
    SwipeoutItem,
    SwipeoutButton
  },
  created: function() {
    // ajax获取消息数据
    var app = this;
    this.$http.get('/messages', {
      params: {
        accesstoken: this.$store.state.accesstoken
      }
    }).then(function(response) {
      // console.log(response.data);
      if (response.data && response.data.success) {
        app.hasReadMsgs = response.data.data.has_read_messages;
        app.hasNotReadMsgs = response.data.data.hasnot_read_messages;
      }
    });
  }
}
</script>
