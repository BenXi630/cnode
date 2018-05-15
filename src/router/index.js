import Vue from 'vue';
import VueRouter from 'vue-router';
import TopicList from '@/components/TopicList.vue';
import Topic from '@/components/Topic.vue';
import Login from '@/components/Login.vue';
import Logout from '@/components/Logout.vue';
import Center from '@/components/Center.vue';
import Msg from '@/components/Msg.vue';
import User from '@/components/User.vue';
import Create from '@/components/Create.vue';
import Edit from '@/components/Edit.vue';

// 全局注册路由
Vue.use(VueRouter);

// 定义路由信息对象
const routes = [
    { path: '/', redirect: '/topiclist/all' },
    { path: '/topiclist/:name', name: 'topiclist', component: TopicList, props: true },
    { path: '/topic/:id', name: 'topic', component: Topic, props: true },
    // 登录操作
    { path: '/login', name: 'login', component: Login },
    // 个人中心
    { path: '/center', name: 'center', component: Center },
    { path: '/user/:loginname', name: 'user', component: User, props: true },
    // 消息通知
    { path: '/msg', name: 'msg', component: Msg },
    // 登出操作
    { path: '/logout', name: 'logout', component: Logout },
    // 发表新话题
    { path: '/create', name: 'create', component: Create },
    // 编辑主题
    { path: '/topic/:id/edit', name: 'edit', component: Edit, props: true }
];

// 创建路由管理器
const router = new VueRouter({
    routes
});

// 对外输出模块
export default router;