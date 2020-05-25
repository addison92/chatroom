<template>
  <div>
    <tools-bar></tools-bar>
    <el-dialog
      title="聊天室配置"
      :visible.sync="dialogVisible"
      width="35%"
      :close-on-click-modal="false"
      :show-close="false"
      :before-close="handleClose"
    >
      <el-form ref="form" :model="form" :rules="rules" :inline="true">
        <el-form-item label="服务器地址" prop="serverIp">
          <el-input placeholder="请输入服务器地址(http://192.168.1.7:8888/chat)" v-model.trim="form.serverIp"></el-input>
        </el-form-item>
        <el-form-item label="webSocket地址" prop="websocketUrl">
          <el-input placeholder="请输入webSocket地址(ws://192.168.1.7:8888/websocket/chat)" v-model.trim="form.wsUrl"></el-input>
        </el-form-item>
        <el-form-item label="登录人" prop="currentUser">
          <!-- <el-input placeholder="请选择登录人" v-model.trim="form.currentUser"></el-input> -->
          <el-select v-model="form.currentUser" placeholder="请选择登录人">
            <el-option v-for="item in userList" :key="item.bh" :label="item.mc" :value="item.bh"></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <span slot="footer">
        <el-button type="primary" @click="commitConfig">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import toolsBar from "@/components/titlebar/toolsBar";
import { mapActions, mapGetters } from "vuex";
import { getUserList } from "@/api/login/index";
export default {
  name: "ipConfig",
  components: {
    toolsBar
  },
  data() {
    return {
      form: {},
      rules: {},
      dialogVisible: true,
      userList:[]
    };
  },
  computed: {
    ...mapGetters(["websocketUrl", "baseURL", "currentUser"])
  },
  created() {
    this.$set(this.form, "serverIp", this.baseURL)
    this.$set(this.form, "wsUrl", this.websocketUrl)
    this.$set(this.form, "currentUser", this.currentUser)


    this.getUserListAsync();
  },
  methods: {
    ...mapActions(["setIp", "setWebSocketUrl", "setCurrentUser"]),

    handleClose() {
      this.dialogVisible = false;
    },

    cancelConfig() {
      this.$router.push("/chat");
    },

    commitConfig() {
      if (!this.form.wsUrl || !this.form.serverIp) {
        this.$message.error("websocket/server不能为空");
        return;
      }
      //赋值给store
      this.setWebSocketUrl(this.form.wsUrl);
      this.setIp(this.form.serverIp);
      this.setCurrentUser(this.form.currentUser);

      // this.$message.success("配置成功", "success");
      this.$router.push("/chat");
    },

    async getUserListAsync(){
      let resp = await getUserList({});
      if(resp.status == '200'){
        this.userList = resp.data;
      }
    }
  }
};
</script>