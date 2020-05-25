import axios from "axios";
import { Message, MessageBox } from "element-ui";
import store from "../store";

// 创建axios实例
const service = axios.create({
  baseURL: store.state.Counter.bdUrl, // api的base_url
  timeout: 100000 // 请求超时时间
});

// request拦截器
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers["X-Token"] = getToken(); // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    return config;
  },
  error => {
    Promise.reject(error);
  }
);

// respone拦截器
service.interceptors.response.use(
  response => {
    if (response.data && response.data.code == "000007") {
      if(count===0){
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
    }else{
      return response;
    }
  },
  error => {
    // for debug
    let text = JSON.parse(JSON.stringify(error));
      Message({
        message: text.response.data.msg,
        type: "error",
        duration: 5 * 1000
      });
    return Promise.reject(error);
  }
);

export default service;