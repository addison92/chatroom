import Vue from "vue";
import axios from "axios";

import App from "./App";
import router from "./router";
import store from "./store";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "@/styles/index.scss"; // global css
import "./assets/css/styleMain.css";
import "@/icons"; // icon
import "@/utils/toDate";
import utils from "@/utils/toast";



if (!process.env.IS_WEB) Vue.use(require("vue-electron"));

Vue.prototype.utils = utils;

Vue.http = Vue.prototype.$http = axios;
Vue.config.productionTip = false;

Vue.use(ElementUI);

/* eslint-disable no-new */
new Vue({
    components: {
        App
    },
    router,
    store,
    template: "<App/>"
}).$mount("#app");