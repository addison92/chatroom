import Vue from "vue";
import Router from "vue-router";
import store from "../store";

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router);
/* Layout */
import Layout from "../views/layout/Layout";
import chat from "../views/chat/index";
import ipConfig from "../views/home/ipConfig";


/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
 **/
const constantRouterMap = [{
  path: "*",
  redirect: "/",
  hidden: true
},
//chat
{
  path: "/chat",
  name: "chat",
  component: chat
},
{
  path: "/",
  name: "ipConfig",
  component: require("@/views/home/ipConfig").default
},
];

const router = new Router({
  // mode: "history", //后端支持可开
  // base: "chattingroom",
  // scrollBehavior: () => ({
  //   y: 0
  // }),
  routes: constantRouterMap
});

//路由导航
// router.beforeEach((to, from, next) => {
//   if (to.matched.some(m => m.meta.auth)) {
//     // 对路由进行验证
//     if (store.getters.loginInfo) { // 已经登陆
//       // eslint-disable-next-line no-console
//       next()
//     } else {
//       // 未登录则跳转到登陆界面，query:{ Rurl: to.fullPath}表示把当前路由信息传递过去方便登录后跳转回来；
//       next({
//         path: '/login'
//       })
//     }
//   } else {
//     next()
//   }
// })

export default router;
