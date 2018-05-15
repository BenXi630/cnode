<template>
  <div>
    <h5>发表新话题</h5>
    <group>
      <x-textarea placeholder="标题" :max="200" :rows="1" v-model="title"></x-textarea>
    </group>
    <mavon-editor v-model="content" :toolbars="toolbars" @imgAdd="uploadImage" ref="md"></mavon-editor>
    <x-button type="primary" @click.native="addtopic">添加新话题</x-button>
  </div>
</template>

<script>
// mavon-editor ：https://github.com/hinesboy/mavonEditor
// 云图片API：https://sm.ms/doc/
import {Group, XTextarea, XButton} from 'vux';
import {mavonEditor} from 'mavon-editor';
// import 'mavon-editor/dist/css/index.css';
import axios from 'axios';
export default {
  name: 'create',
  data() {
    return {
      title: '',
      content: '',
      // mavonEditor工具栏配置
      toolbars: {
        bold: true, // 粗体
        italic: true, // 斜体
        header: true, // 标题
        underline: true, // 下划线
        ol: true, // 有序列表
        ul: true, // 无序列表
        link: true, // 链接
        imagelink: true, // 图片链接
        code: true, // code
        fullscreen: true, // 全屏编辑
        htmlcode: true, // 展示html源码
        help: true, // 帮助
        alignleft: true, // 左对齐
        aligncenter: true, // 居中
        alignright: true, // 右对齐
        preview: true // 预览
      }
    };
  },
  methods: {
    // 上传图片到云服务器（sm.ms）
    uploadImage: function(pos, file) {
      var app = this;
      // pos表示当前markdown图片的序号
      // file表示上传的图片的File对象
      // console.log(pos);
      // console.log(file);
      // step1: 把图片上传到云服务器（axios发送请求）
      var params = new FormData();
      params.append('smfile', file);
      // 云服务器地址是：https://sm.ms/api/upload
      axios.post('https://sm.ms/api/upload', params, {
        // 请求的配置信息(上传文件需要给出附加配置)
        // 文件上传必须为POST请求
        // 文件上传必须指定Content-Type: multipart/form-data
        headers: { 'Content-Type': 'multipart/form-data' }
      }).then(function(response) {
        // step2：图片上传成功后，修改markdown内容
        // console.log(response);
        app.$refs.md.$img2Url(pos, response.data.data.url);
      });
    },
    // 添加新话题
    addtopic: function() {
      var app = this;
      // 发送ajax请求
      this.$http.post('/topics', {
        title: this.title,
        content: this.content,
        tab: 'dev',
        accesstoken: this.$store.state.accesstoken
      }).then(function(response) {
        if (response.data && response.data.success) {
          // 话题添加成功
          app.$router.replace('/topiclist/dev');
        }
      });
    }
  },
  components: {
    Group,
    XTextarea,
    XButton,
    mavonEditor
  }
};
</script>

<style src="mavon-editor/dist/css/index.css"></style>