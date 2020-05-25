<template>
  <div class="login">
    <tools-bar></tools-bar>
    <div class="loginBg">
      <img :src="mainBg" alt style="background-size: 100%;width: 100%;height: 100%;" />
    </div>
    <div class="loginMain">
      <div class="loginTitle">
        <img :src="loginLogo" alt />
        <span class="loginTitleLine">&nbsp;</span>
        <span class="loginTitleShadowText">便携式指挥仪软件</span>
      </div>
      <div class="loginForm">
        <h1 class="loginFormTitle">系统登录</h1>
        <el-form ref="form" :model="form">
          <!-- <el-form-item>
            <el-select style="width: 380px;" v-model="formInline.region" placeholder="请输入单位">
              <i slot="prefix" class="el-icon-school"></i>
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>-->

          <el-form-item>
            <el-input
              style="width: 380px;"
              placeholder="请输入用户名"
              v-model="form.username"
              @keydown.native.enter="doLogin"
            >
              <i slot="prefix" class="el-icon-user"></i>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-input
              style="width: 380px;"
              placeholder="请输入密码"
              type="password"
              v-model="form.password"
              @keydown.native.enter="doLogin"
              show-password
            >
              <i slot="prefix" class="el-icon-unlock"></i>
            </el-input>
          </el-form-item>
          <!-- <el-form-item>
            <el-input
              style="width: 260px;float: left;"
              placeholder="请输入验证码"
              v-model="verificationCode"
            >
              <i slot="prefix" class="el-icon-key"></i>
            </el-input>
            <el-button
              v-no-more-click
              type="primary"
              style="width:100px;float: left;margin-left:20px"
            >验证码</el-button>
          </el-form-item>-->

          <el-form-item>
            <el-button v-no-more-click type="warning" @click="doLogin" style="width:380px;">登录</el-button>
          </el-form-item>
          <el-form-item>
            <el-button v-no-more-click type="warning" @click="ip" style="width:380px;">服务器配置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import toolsBar from "@/components/titlebar/toolsBar";
import { login } from "@/api/login";
import { personDevice } from "@/api/communicate/index";
import { getJbjlZddwXxInfoList } from "@/api/wjRecord/wjPerson";
import { mapActions, mapGetters } from "vuex";

export default {
  components: {
    toolsBar
  },
  data() {
    return {
      loginLogo: "static/images/html/loginLogo.png",
      mainBg: "static/images/html/mainBg.png",
      formInline: {
        user: "",
        region: ""
      },
      company: "",
      userName: "",
      verificationCode: "",
      passWord: "",
      form: {}
    };
  },
  created() {},
  computed: {
    ...mapGetters(["devciceBm"])
  },
  mounted() {},
  methods: {
    ...mapActions([
      "setLoginInfo",
      "setSidebarIdList",
      "setDeviceInfo",
      "setDwList"
    ]),
    ip() {
      this.$router.push("/");
    },
    doLogin() {
      if (!this.form.username || !this.form.password) {
        this.utils.showToast("用户名或密码不能为空！");
        return;
      }
      this.loginAsync();
    },

    //登录
    async loginAsync() {
      this.form.ssxt = "4";
      this.form.devciceBm = this.devciceBm;
      let resp = await login(this.form);
      resp = resp.data;

      var userMenuPermissionSet = resp.roleSet[0].userMenuPermmisionSet;
      var menuList = [];
      var buttonMenu = {},
        buttonMenuConfig = [];

      userMenuPermissionSet.forEach(item => {
        menuList.push(item.menuCode);
        (item.childMenuPermmisionSet || []).forEach(element => {
          menuList.push(element.menuCode);
          // buttonMenu[element.menuCode] = element.userPermissionSet;
        });
        (item.childMenuPermmisionSet.userPermissionSet || []).forEach(
          element => {
            buttonMenuConfig.push(element.pmCode);
            console.log("buttonMenuConfig", buttonMenuConfig);
          }
        );
      });
      this.setLoginInfo(resp);
      this.setSidebarIdList(menuList);
      //存储设备信息到vuex
      this.personDeviceAsync();
      //存储dw到vuex
      this.getJbjlZddwXxInfoListAsync();

      this.$router.push("/policePlan/xdzs");
      this.form = {};

      var now = new Date().Format('yyyy-MM-dd hh:mm:ss')
      this.$insertLog(`${now}, ${resp.xm} 登录系统.`);
      this.utils.showToast("登录成功!",'success');
    },

    async personDeviceAsync() {
      let resp = await personDevice({});
      if (resp.status == "200") {
        this.setDeviceInfo(resp.data);
      }
    },

    //驻地单位
    async getJbjlZddwXxInfoListAsync() {
      let resp = await getJbjlZddwXxInfoList();
      if (resp.status == "200") {
        this.setDwList(resp.data);
      }
    }
  }
};
</script>
<style scoped>
.loginBg {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  /*background: url("static/images/html/mainBg.png") no-repeat;*/
}

.el-form {
  margin: 0;
}
</style>


