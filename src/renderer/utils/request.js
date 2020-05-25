import axios from "axios";
import { Message, MessageBox, Loading } from "element-ui";
import store from "../store";
import "./toDate";
import insertLog from "./insertLog";

// 创建axios实例
const service = axios.create({
  baseURL: store.state.Counter.baseURL, // api的base_ur
  timeout: 300000 // 请求超时时间
});

var loadingInstance;
var loadingCount = 0;
var count = 0;
const showLoading = () => {
  if (loadingCount === 0) {
    loadingInstance = Loading.service({
      target: ".app-wrapper",
      fullscreen: false,
      text: "加载中"
      // background:'rgba(0,0,0,0.7)'
    });
  }
  loadingCount++;
};

const hideLoading = () => {
  if (loadingCount <= 0) return;
  loadingCount--;
  if (loadingCount === 0) {
    loadingInstance.close();
  }
};

// request拦截器
service.interceptors.request.use(
  config => {
    config.baseURL = store.state.Counter.baseURL;

    if (store.getters.token) {
      config.headers["X-Token"] = getToken(); // 让每个请求携带自定义token 请根据实际情况自行修改
    }

    //loading
    showLoading();
    return config;
  },
  error => {
    Promise.reject(error);
  }
);

// respone拦截器
service.interceptors.response.use(
  response => {
    hideLoading();
    if (response.data && response.data.code == "000007") {
      if (count === 0) {
        Message({
          message: response.data.message,
          type: "error",
          duration: 3 * 1000
        });
      }

      MessageBox.confirm("登录异常,请重新登录!", "", {
        confirmButtonText: "重新登录",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => { 
        window.location = "http://localhost:9070/#/login";
      });
      count++;
    } else {
      return response;
    }
  },
  error => {
    hideLoading();

    // for debug
    if (error.response&&error.response.data && error.response.data.code) {
      Message({
        message: error.response.data.msg,
        type: "warning",
        duration: 1 * 1000
      });
    } else {
      hideLoading();
      //记录日志
      var now = new Date().Format("yyyy-MM-dd hh:mm:ss");
      insertLog(
        `${now},${
          store.state.Counter.loginInfo ? store.state.Counter.loginInfo.xm : ""
        } 操作发生异常: ${error.response.data.msg}`
      );
      
      if(error.response&&error.response.data){
        Message({
          message: error.response.data.msg || "系统异常,请退出重试",
          type: "error",
          duration: 1 * 1000
        });
      }
    }

    count++;
    return Promise.reject(error);
  }
);

export default service;
