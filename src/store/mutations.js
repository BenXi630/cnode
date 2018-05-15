const mutations = {
    mutationIsShowMoreMenus: function(state, payload) {
        // state表示当前状态数据
        // payload表示使用方传递的附加数据
        state.isShowMoreMenus = payload;
    },
    // 实现用户登录操作
    mutationLogin: function(state) {
        state.isLogined = true;
    },
    // 修改loginnmae
    mutationLoginname: function(state, payload) {
        state.loginname = payload;
    },
    // 修改accesstoken
    mutationAccessToken: function(state, payload) {
        state.accesstoken = payload;
    },
    // 用户注销操作
    mutationLogout: function(state) {
        state.isLogined = false;
        state.loginname = '';
        state.accesstoken = '';
    },
    // 修改author_id
    mutationAuthorId: function(state, payload) {
        state.author_id = payload;
    }
};
export default mutations;