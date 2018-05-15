// vuex状态管理
import Vue from 'vue';
import Vuex from 'vuex';
import mutations from './mutations.js';
import actions from './actions.js';

// 全局注册
Vue.use(Vuex);

// 创建Store对象
const store = new Vuex.Store({
    // 状态数据
    state: {
        // 主题分类数据
        topics: [
            { name: 'all', desc: '全部' },
            { name: 'good', desc: '精华' },
            { name: 'share', desc: '分享' },
            { name: 'ask', desc: '问答' },
            { name: 'job', desc: '招聘' },
            { name: 'dev', desc: '测试' },
        ],
        // 未登录时更多菜单
        unLoginedMoreMenus: {
            login: '登录'
        },
        // 登录时的更多菜单
        loginedMoreMenus: {
            create: '发表新话题',
            center: '个人中心',
            msg: '消息通知<badge></badge>',
            logout: '登出'
        },
        // 登录状态
        isLogined: false,
        // 登录用户名
        loginname: '',
        // 登录用户的accesstoken
        accesstoken: '',
        // 登录用户id
        author_id: '',
        // 是否显示更多菜单
        isShowMoreMenus: false
    },
    // 状态数据的计算属性
    getters: {
        moreMenus: function(state) {
            if (state.isLogined) {
                // 用户处理登录状态，返回登录后的更多菜单
                return state.loginedMoreMenus;
            }
            return state.unLoginedMoreMenus;
        },
        getTopicDescByTab: function(state) {
            // 需要返回一个函数结构
            return function(tab) {
                for (var index = 0; index < state.topics.length; index++) {
                    if (state.topics[index].name == tab) {
                        return state.topics[index].desc;
                    }
                }
            };
        }
    },
    mutations,
    actions
});

// 对外输出模块
export default store;