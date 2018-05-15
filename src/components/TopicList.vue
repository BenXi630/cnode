<template>
<div>
  <tab v-bind:line-width="1">
    <tab-item v-for="(item, index) in topics" :key="index" :selected="$route.path == '/topiclist/' + item.name" @on-item-click="routeto">{{item.desc}}</tab-item>
  </tab>
  <scroller lock-x scrollbarY use-pullup :pullup-config="pullupConfig" use-pulldown :pulldown-config="pulldownConfig" height="-46" @on-pullup-loading="loadMoreData" @on-pulldown-loading="freshData" ref="pullup">
    <div>
      <group>
        <cell v-for="(item, index) in lists" :key="index" is-link v-bind:link="'/topic/' + item.id">
          <span slot="title" class="cell_title">
            <span class="reply_count">
              {{item.reply_count}}
            </span>
            /
            <span class="visit_count">
              {{item.visit_count}}
            </span>
            <span v-if="item.top" class="top">
              置顶
            </span>
            <span class="tab" v-if="$route.path == '/topiclist/all'">
              {{getDescByTab(item.tab)}}
            </span>
            <span class="title">
              {{item.title}}
            </span>
          </span>
          <span slot="icon" class="cell_author_avatar">
            <img :src="item.author.avatar_url">
          </span>
        </cell>
      </group>
    </div>
  </scroller>
</div>
</template>

<script>
import {Group, Cell, Scroller, Tab, TabItem} from 'vux';
import {mapState} from 'vuex';
export default {
  name: 'topiclist',
  props: ['name'],
  components: {
    Group,
    Cell,
    Scroller,
    Tab,
    TabItem
  },
  computed: {
    ...mapState(['topics'])
  },
  data: function() {
    return {
      lists: [],
      // 当前页数
      page: 1,
      // 每一页显示的数据
      limit: 15,
      // 上拉加载更多组件配置信息
      pullupConfig: {
        content: '上拉加载更多',
        downContent: '松开进行加载',
        upContent: '上拉加载更多',
        loadingContent: '加载中...'
      },
      // 下拉刷新数据配置信息
      pulldownConfig: {
        content: '下拉刷新',
        downContent: '松开刷新数据',
        upContent: '下拉刷新数据',
        loadingContent: '加载中...'
      }
    };
  },
  methods: {
    // 下拉刷新数据
    freshData: function() {
      var app = this;
      this.$http.get('/topics', {
        params: {
          tab: this.name,
          page: 1,
          limit: this.limit
        }
      }).then(function(response) {
        if (response.data && response.data.success) {
          app.lists = response.data.data;
          app.page = 1;
          // 手动结束加载进度
          app.$refs.pullup.donePulldown();
        }
      });
    },
    // 根据tab获取topic.desc
    getDescByTab(tab) {
      return this.$store.getters.getTopicDescByTab(tab);
    },
    // 当单击路由链接时，实现路由跳转
    routeto(index) {
      // 参数index表示当前点击的tab项在整个tab中的位置序号(从0开始)
      // 实现编程式路由导航
      this.$router.push('/topiclist/' + this.topics[index].name);
    },
    // 上拉刷新时，ajax加载更多数据
    loadMoreData() {
      var app = this;
      this.page = this.page + 1;
      // 发送ajax请求
      this.$http.get('/topics', {
        params: {
          tab: this.name,
          page: this.page,
          limit: this.limit
        }
      }).then(function(response) {
        if (response.data.success) {
          // 异步请求，此时this不再表示当前组件对象
          // app.lists = response.data.data;
          for (var i = 0; i < response.data.data.length; i++) {
            app.lists.push(response.data.data[i]);
          }
          // 手动结束上拉刷新过程
          // 父组件中获取子组件，使用 $refs 对象
          app.$refs.pullup.donePullup();
        }
      });
    }
  },
  // Ajax可以使用在生命周期回调函数
  // Ajax也可以使用在导航守卫中(特别适合动态路由组件)
  beforeRouteEnter: function(to, from, next) {
    // 进入该组件之前的回调操作，此处不能使用 this对象
    // to表示待进入的组件路由
    // from表示离开的组件路由
    // next表示函数勾子，执行下一步操作
    next(function(vm) {
      // vm表示当前组件的实例对象
      vm.$http.get('/topics', {
        params: {
          tab: to.params.name,
          page: vm.page,
          limit: vm.limit
        }
      }).then(function(response) {
        // response表示响应消息对象
        // response.data表示响应消息主体
        if (response.data.success) {
          vm.lists = response.data.data;
        }
      });
    });
  },
  // 动态路由切换时导航守卫
  beforeRouteUpdate: function(to, from, next) {
    // 可以直接使用this表示当前组件对象
    var app = this;
    // 重新发送ajax请求
    this.$http.get('/topics', {
      params: {
        tab: to.params.name,
        page: this.page,
        limit: this.limit
      }
    }).then(function(response) {
      if (response.data.success) {
        // 异步请求，此时this不再表示当前组件对象
        app.lists = response.data.data;
      }
    });
    // 执行下一步操作
    next();
  }
}
</script>

<style>
.cell_title {
  font-size: .8em;
}
.cell_title .reply_count {
  color: #9e78c0;
}
.cell_title .visit_count {
  color: #b4b4b4;
}
.cell_title .top {
  background: #80bd01;
  padding: 2px 4px;
  border-radius: 3px;
  color: #fff;
  font-size: 12px;
}
.cell_title .tab {
    background-color: #e5e5e5;
    color: #999;
    padding: 2px 4px;
    border-radius: 3px;
    font-size: 12px;
}
.cell_author_avatar img {
  width: 30px;
    height: 30px;
    border-radius: 3px;
    margin-right: 5px;
}
</style>
