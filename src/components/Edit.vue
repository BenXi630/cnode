<template>
  <div>
    <h5>编辑话题</h5>
    <group>
      <x-textarea placeholder="标题" :max="200" :rows="1" v-model="topic.title"></x-textarea>
    </group>
    <mavon-editor v-model="topic.content"></mavon-editor>
    <x-button type="primary" @click.native="edittopic">修改话题</x-button>
  </div>
</template>

<script>
import {Group, XTextarea, XButton} from 'vux';
import {mavonEditor} from 'mavon-editor';
// import 'mavon-editor/dist/css/index.css';
export default {
  name: 'edit',
  props: ['id'],
  data: function() {
    return {
      topic: {
        title: '',
        content: ''
      }
    };
  },
  methods: {
    // 修改话题
    edittopic: function() {
      var app = this;
      this.$http.post('/topics/update', {
        topic_id: this.topic.id,
        title: this.topic.title,
        content: this.topic.content,
        accesstoken: this.$store.state.accesstoken,
        tab: 'dev'
      }).then(function(response) {
        // console.log(response.data);
        // 实现页面跳转
        app.$router.back();
      });
    }
  },
  components: {
    Group,
    XTextarea,
    XButton,
    mavonEditor
  },
  beforeRouteEnter: function(to, from, next) {
    next(function(vm) {
      vm.$http.get('/topic/' + to.params.id).then(function(response) {
        vm.topic = response.data.data;
      });
    });
  },
  beforeRouteUpdate: function(to, from, next) {
    var app = this;
    app.$http.get('/topic/' + to.params.id).then(function(response) {
        app.topic = response.data.data;
      });
    next();
  }
}
</script>

<style src="mavon-editor/dist/css/index.css"></style>
