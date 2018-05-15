<template>
  <div v-if="userinfo">
    <card :header="{ title: userinfo.loginname}" :footer="{ title: userinfo.create_at }">
      <div slot="content" class="card_content">
        <p>
          <img :src="userinfo.avatar_url">
        </p>
        <p>
          用户积分：{{userinfo.score}}
        </p>
        <p>
          <a href="/#/collect/">{{collect_topics.length}}个话题被收藏</a>
        </p>
        <p>
          <a :href="'https://github.com/' + userinfo.githubUsername">@{{userinfo.githubUsername}}</a>
        </p>
      </div>
    </card>
    <card :header="{title: '最近发表的话题'}">
      <group slot="content">
        <cell v-for="(item, index) in userinfo.recent_topics" :key="index" :title="item.title" is-link :link="'/topic/' + item.id"></cell>
      </group>
    </card>
  </div>
</template>

<script>
import {Card, Group, Cell} from 'vux';
export default {
  name: 'user',
  props: ['loginname'],
  components: {
    Card,
    Group,
    Cell
  },
  data: function() {
    return {
      userinfo: null,
      collect_topics: []
    };
  },
  beforeRouteEnter: function(to, from, next) {
    next(function(vm) {
      // 获取用户信息
      vm.$http.get('/user/' + to.params.loginname).then(function(response) {
        // console.log(response.data);
        vm.userinfo = response.data.data;
      });
      // 获取用户收藏的主题信息
      vm.$http.get('/topic_collect/' +to.params.loginname).then(function(response) {
        vm.collect_topics = response.data.data;
      });
    });
  },
  beforeRouteUpdate: function(to, from, next) {
    var app = this;
    this.$http.get('/user/' + to.params.loginname).then(function(response) {
      // console.log(response.data);
      app.userinfo = response.data.data;
    });
    // 获取用户收藏的主题列表
      app.$http.get('/topic_collect/' +to.params.loginname).then(function(response) {
        app.collect_topics = response.data.data;
      });
    next();
  }
}
</script>

<style>
.card_content p {
  padding: 5px;
  color: #ccc;
}
.card_content p img {
  width: 60px;
  height: 60px;
}
</style>
