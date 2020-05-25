const state = {
  currentUser: null,
  baseURL: "http://192.168.1.7:8888/chat",
  websocketUrl: "ws://192.168.1.7:8888/websocket/chat",
};

const getters = {
  currentUser: function (state) {
    if (!state.currentUser) {
      state.currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    }
    return state.currentUser;
  },
  baseURL: function (state) {
    if (!state.baseURL) {
      state.baseURL = JSON.parse(sessionStorage.getItem("baseURL"));
    }
    return state.baseURL;
  },
  websocketUrl: function (state) {
    if (!state.websocketUrl) {
      state.websocketUrl = JSON.parse(sessionStorage.getItem("websocketUrl"));
    }
    return state.websocketUrl;
  },
};

const mutations = {
  SET_CURRENTUSER(state, i) {
    state.currentUser = i;
    sessionStorage.setItem("currentUser", JSON.stringify(i));
  },
  //配置ip
  SET_IP(state, order) {
    state.baseURL = order;
    sessionStorage.setItem("baseURL", JSON.stringify(order));
  },

  SET_WEBSOCKETURL(state, i) {
    state.websocketUrl = i;
    sessionStorage.setItem("websocketUrl", JSON.stringify(i));
  },
}

const actions = {
  setCurrentUser({ commit }, i) {
    commit("SET_CURRENTUSER", i);
  },
  //配置ip
  setIp({ commit }, order) {
    commit("SET_IP", order);
  },

  setWebSocketUrl({ commit }, i) {
    commit("SET_WEBSOCKETURL", i);
  },
};

export default {
  state,
  mutations,
  actions,
  getters
};
