<template>
  <div v-if="topic">
    <article class="weui-article">
      <h1>
        {{topic.title}}
        <x-button v-if="topic.author_id == $store.state.author_id" :mini="true" type="primary" :link="'/topic/' + topic.id + '/edit'">编辑</x-button>
        <x-button v-if="topic.is_collect == false" :mini="true" type="primary" @click.native="collect">收藏</x-button>
        <x-button v-else :mini="true" @click.native="decollect">取消收藏</x-button>
      </h1>
      <section>
        <span>作者：<a :href="'/#/user/' + topic.author.loginname">{{topic.author.loginname}}</a></span>
        <span>{{topic.visit_count}}次浏览</span>
        <span>来自 <a :href="'/#/topiclist/' + topic.tab">{{topic.tab}}</a></span>
      </section>
      <hr>
      <section v-html="topic.content"></section>
    </article>
    <group>
      <cell-box v-for="(item, index) in topic.replies" :key="index">
        <flexbox>
          <flexbox-item :span="1">
            <img :src="item.author.avatar_url" style="width: 30px; height: 30px;">
          </flexbox-item>
          <flexbox-item :span="7">
            <section>
              <div>
                <a :href="'/#/user/' + item.author.loginname">{{item.author.loginname}}</a>
                {{index+1}}楼
              </div>
              <div v-html="item.content"></div>
            </section>
          </flexbox-item>
          <flexbox-item :span="4">
            <span @click="upOrDown(item.id)">
              <wechat-emotion>强</wechat-emotion>
              {{item.ups.length}}
            </span>
            <span v-if="isLogined" @click="showPopup(item.id, item.author.loginname)">
              回复
            </span>
          </flexbox-item>
        </flexbox>
      </cell-box>
    </group>
    <group>
      <x-textarea placeholder="评论内容" v-model="replyContent"></x-textarea>
    </group>
    <x-button :mini="true" type="primary" @click.native="addreply(1)">回复</x-button>

    <!-- 弹出框 -->
    <div v-transfer-dom>
      <popup v-model="isShowPopup" @on-hide="hidepopup">
        <group>
          <x-textarea v-model="replyContent" placeholder="请输入评论内容"></x-textarea>
        </group>
        <x-button :mini="true" type="primary" @click.native="addreply(2)">回复</x-button>
      </popup>
    </div>
  </div>
</template>

<script>
import {Group, CellBox, Flexbox, FlexboxItem, WechatEmotion, XTextarea, XButton, Popup, TransferDom} from 'vux';
import {mapState} from 'vuex';
export default {
  name: 'topic',
  props: ['id'],
  computed: {
    ...mapState(['isLogined'])
  },
  data: function() {
    return {
      topic: null,
      replyContent: '',
      isShowPopup: false,
      reply_id: null,
      reply_loginname: ''
    };
  },
  methods: {
    // 取消收藏主题
    decollect() {
      var app = this;
      this.$http.post('/topic_collect/de_collect', {
        accesstoken: this.$store.state.accesstoken,
        topic_id: this.topic.id
      }).then(function(response) {
        if (response.data && response.data.success) {
          app.topic.is_collect = false;
        }
      });
    },
    // 收藏主题
    collect: function() {
      var app = this;
      this.$http.post('/topic_collect/collect', {
        accesstoken: this.$store.state.accesstoken,
        topic_id: this.topic.id
      }).then(function(response) {
        // 判断是否成功
        if (response.data && response.data.success) {
          // ajax修改按钮状态 “收藏” -> “取消收藏”
          app.topic.is_collect = true;
        }
      });
    },
    // 实现点赞或取消点赞
    upOrDown: function(reply_id) {
      // console.log('up or down');
      var app = this;
      // 发送ajax请求
      this.$http.post('/reply/' + reply_id + '/ups', {
        accesstoken: this.$store.state.accesstoken
      }).then(function(response) {
        // console.log(response.data);
        if (response && response.data && response.data.success) {
          // 点赞或取消点赞成功
          var type = response.data.action;
          if (type == 'up') { // 点赞
            // 修改当前评论的ups数组的元素（添加一条元素）
            var reply;
            // 先获取到当前评论
            for (var index = 0; index <= app.topic.replies.length; index++) {
              if (app.topic.replies[index].id == reply_id) {
                // 找到了指定的评论
                reply = app.topic.replies[index];
                break;
              }
            }
            // 实现点赞功能
            // 在ups数组添加当前用户的id值
            // 当前用户的id值，我们可以在用户登录时获取到，把它保存到vuex状态中
            // 此处仅仅是模拟，需要自己修改
            reply.ups.push(app.$store.state.accesstoken);
          } else if (type == 'down') { // 取消点赞
            var reply;
            // 先获取到当前评论
            for (var index = 0; index <= app.topic.replies.length; index++) {
              if (app.topic.replies[index].id == reply_id) {
                // 找到了指定的评论
                reply = app.topic.replies[index];
                break;
              }
            }
            // 在当前评论的ups数组中删除掉当前用户id所对应的记录
            // 仅仅做一个模拟，实际上应该先找到指定元素的下标，然后再使用 splice 删除指定元素
            reply.ups.pop();
          }
        }
      });
    },
    // 关闭弹出框的回调函数
    hidepopup() {
      this.reply_id = null;
      this.reply_loginname = '';
    },
    // 显示弹出框
    showPopup: function(reply_id, reply_loginname) {
      // reply_id表示当前评论的id值
      // 后续发表评论时，需要使用这个字段
      this.isShowPopup = true;
      this.reply_id = reply_id;
      this.reply_loginname = reply_loginname;
    },
    // 回复评论
    addreply: function(replyTab) {
      // 若replyTab为1，表示为主话题进行评论
      // 若replyTab为2，表示回复其它评论的评论
      var params = {
        accesstoken: this.$store.state.accesstoken,
        content: this.replyContent
      };
      if (replyTab == 2) {
        params.reply_id = this.reply_id;
        // 构造 @vuelenovo 形式的回复内容
        params.content = '@' + this.reply_loginname + ' ' + params.content;
      }
      // 发送ajax请求
      var app = this;
      this.$http.post('/topic/' + this.topic.id + '/replies', params).then(function(response) {
        // console.log(response.data);
        if (response.data && response.data.success) {
          // 评论发表成功
          // 手动显示当前评论
          var reply = {
            "id": response.data.reply_id,
            "author": {
                "loginname": app.$store.state.loginname,
                // 此处需要再次处理
                "avatar_url": "https://avatars1.githubusercontent.com/u/4295945?v=3&s=120"
            },
            "content": params.content,
            "ups": [],
            "create_at": "2014-10-07T12:11:18.981Z",
            "reply_id": null,
            "is_uped": false
          };
          if (replyTab == 2) {
            reply.reply_id = app.reply_id;
          }
          app.topic.replies.push(reply);
          // 重置输入框区域
          app.replyContent = '';
          app.reply_id = null;
          app.isShowPopup = false;
          app.reply_loginname = '';
        }
      });
    }
  },
  components: {
    Group,
    CellBox,
    Flexbox,
    FlexboxItem,
    WechatEmotion,
    XTextarea,
    XButton,
    Popup
  },
  directives: {
    TransferDom
  },
  beforeRouteEnter: function(to, from, next) {
    next(function(vm) {
      // 执行Ajax
      vm.$http.get('/topic/' + to.params.id, {
        params: {
          accesstoken: vm.$store.state.accesstoken
        }
      }).then(function(response) {
        // console.log(response.data);
        vm.topic = response.data.data;
      });
    });
  },
  beforeRouteUpdate: function(to, from, next) {
    var app = this;
    this.$http.get('/topic/' + to.params.id, {
      params: {
        accesstoken: this.$store.state.accesstoken
      }
    }).then(function(response) {
      // console.log(response.data);
      app.topic = response.data.data;
    });
    next();
  }
};
</script>

<style lang="less">
@import '~vux/src/styles/weui/weui.less';
section img {
  max-width: 100%;
  max-height: 100%;
}
</style>
