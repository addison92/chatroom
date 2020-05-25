<template>
  <div>
    <div class="main-body">
      <tools-bar></tools-bar>
      <div class="chatting-head">
        <span>当前登录用户：</span>
        <el-select class="chooseUser" v-model="currentUser" placeholder="请选择用户" disabled>
          <el-option v-for="item in userList" :key="item.bh" :label="item.mc" :value="item.bh"></el-option>
        </el-select>
      </div>
      <el-button style="display:inline-block" type="primary" @click="handleBack">返回</el-button>
      <div class="chatting-body">
        <div class="chatting-users">
          <div class="chatting-list">通讯录</div>
          <ul>
            <li
              v-for="item in chattingUsers"
              :key="item.bh"
              @click="handleChattingUserSelect(item)"
              :class="currentChattingUser==item.bh?'isChatting':''"
            >
              {{item.mc}}
              <!-- 消息提示 -->
              <span v-show="item.count>0">{{item.count}}</span>
            </li>
          </ul>
        </div>
        <div class="chatting-msg">
          <div class="main-msg">
            <ul style="height: 480px;overflow-y: scroll;" id="message-list">
              <li
                :class="item.senderId == currentUser?'msgFromMe':'msgFromOthers'"
                v-for="(item, index) in msgList"
                :key="index"
              >
                <img
                  v-if="item.senderId == currentUser"
                  src="../../assets/images/user_avatar.png"
                  alt
                  style="width:35px;"
                />
                <img v-else src="../../assets/images/icon/icon-person.png" alt style="width:35px;" />
                <br />
                <span v-if="item.type =='0'">{{item.content}}</span>
                <span style="cursor:pointer" v-else @click="handleAttachDownload(item)">
                  <i class="el-icon-download">上传了{{(item.sysAnnex||{}).ymc}}文件</i>
                </span>
              </li>
            </ul>
          </div>
          <div class="chat-attach">
            <el-upload
              class="upload-demo"
              :action="`${baseURL}/minIoController/uploadFile`"
              name="multipartFile"
              :show-file-list="false"
              :before-upload="beforeUpload"
              :on-success="handleSuccess"
              :on-error="handleError"
              :file-list="fileList"
            >
              <div>
                上传附件
                <i class="el-icon-upload2"></i>
              </div>
            </el-upload>
          </div>
          <div class="chatArea">
            <el-input
              class="chat-input"
              placeholder="聊天信息(Enter发送)"
              type="textarea"
              v-model="msg"
              @keydown.native="handleSendMsgByEnter($event)"
            ></el-input>
          </div>
          <el-button class="sendMsg" type="primary" @click="handleSendMsg">发送</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import toolsBar from "@/components/titlebar/toolsBar";
import { getUserList } from "@/api/login/index";
import { mapActions, mapGetters } from "vuex";

export default {
  components: {
    toolsBar
  },
  data() {
    return {
      userList: [],
      msg: "",
      currentChattingUser: "-1",
      ws: null,
      currentRoomId: "",
      msgList: [
        {
          senderId: 1,
          recipientId: 2,
          type: "0",
          content:
            "是否将下拉是否将下拉是否将下拉列表插入至 body 元素。在下拉列表的定位出现问题时，可将该属性设置为 false列表插入至 body 元素。在下拉列表的定位出现问题时，可将该属性设置为 false列表插入至 body 元素。在下拉列表的定位出现问题时，可将该属性设置为 false"
        },
        {
          senderId: 2,
          recipientId: 1,
          type: "0",
          content:
            "是否将下拉列表插是否将下拉列表插入至 body 元素。在下拉列表的定位出现问题时，可将该属性设置为 false入至 body 元素。在下拉列表的定位出现问题时，可将该属性设置为 false"
        },
        {
          senderId: 2,
          recipientId: 1,
          type: "0",
          content:
            "是否将下拉列表插是否将下拉列表插入至 body 元素。在下拉列表的定位出现问题时，可将该属性设置为 false入至 body 元素。在下拉列表的定位出现问题时，可将该属性设置为 false"
        }
      ],
      fileList: [],
      chattingIdList: []
    };
  },
  computed: {
    ...mapGetters(["websocketUrl", "baseURL", "currentUser"]),
    chattingUsers: function() {
      return this.userList.filter(item => {
        return this.currentUser != item.bh;
      });
    }
  },
  created() {
    //初始化ws 与机器人-1，建立连接；
    this.createWsConnection();
    this.getUserListAsync();
  },
  updated() {
    //消息滚动到底部
    let ele = document.getElementById("message-list");
    ele.scrollTop = ele.scrollHeight;
  },
  methods: {
    // 返回
    handleBack() {
      this.$router.push({
        path: "/"
      });
    },

    //上传成功
    handleSuccess(res, file) {
      console.log("res:", res);
      this.fileList = [res];
      let fjbh = this.fileList[0].bh;
      this.handleSendFile(fjbh);
    },

    //上传前校验
    beforeUpload(file) {
      if (!this.currentChattingUser || this.currentChattingUser < 0) {
        this.$message.warning("请先选择聊天对象");
        return false;
      }
    },

    //处理异常
    handleError(err, file, fileList) {
      console.log("err:", err);
    },

    // 建立webSocket连接
    createWsConnection() {
      if (this.ws) {
        // 关闭ws
        this.ws.onclose = function(evt) {
          //绑定关闭或断开连接事件
          console.log("Connection closed.");
        };
      }

      this.ws = new WebSocket(this.websocketUrl);
      let self = this;
      this.ws.onopen = function(ev) {
        console.log("连接成功");
        self.ws.sendJson({
          messageHistoryVO: {
            senderId: self.currentUser,
            recipientId: self.currentChattingUser
          },
          messageTypeEnum: "CONNECTION_SUCCESS"
        });
      };

      this.ws.onmessage = function(event) {
        var message = JSON.parse(event.data);
        console.log("ws-message:", message.messageTypeEnum);
        switch (message.messageTypeEnum) {
          case "CONNECTION_SUCCESS":
            self.currentRoomId = message.roomId;
            break;
          case "SINGLE_CHAT_TEXT":
          case "SINGLE_CHAT_FILE":
            //接收人是自己时
            if (
              message.messageHistoryVO.senderId == self.currentChattingUser ||
              message.messageHistoryVO.senderId == self.currentUser
            ) {
              self.msgList.push(message.messageHistoryVO);
            } else {
              //加1
              let index = self.chattingIdList.indexOf(
                message.messageHistoryVO.senderId
              );

              if (index != -1) {
                var element = self.chattingUsers[index];
                element.count = Number(element.count) + 1;
                self.$set(self.chattingUsers, index, element);
              }
            }
            break;
          default:
            break;
        }
      };

      this.ws["sendJson"] = function(param) {
        self.ws.send(JSON.stringify(param));
      };

      this.ws.onerror = function(ev) {
        self.$message.error("连接Websocket Error");
      };
    },

    handleSendMsgByEnter(e) {
      if (e.keyCode == 13) {
        this.handleSendMsg();
        e.preventDefault();
        return false;
      }
    },

    // 发送文本消息
    handleSendMsg() {
      if (!this.currentChattingUser || this.currentChattingUser < 0) {
        this.$message.warning("请先选择聊天对象");
        return;
      }
      if (!this.msg) {
        this.$message.warning("消息不能为空");
        return;
      }

      this.msg = this.msg.replace(/\n/g, "");

      let p = {
        senderId: this.currentUser,
        recipientId: this.currentChattingUser,
        type: "0",
        content: this.msg
      };
      this.ws.sendJson({
        messageHistoryVO: p,
        messageTypeEnum: "SINGLE_CHAT_TEXT"
      });
      this.msgList.push(p);
      this.msg = "";
    },

    //发送文件
    handleSendFile(fjList) {
      let p = {
        senderId: this.currentUser,
        recipientId: this.currentChattingUser,
        type: "3", //前端使用
        sysAnnexBh: fjList
      };
      this.ws.sendJson({
        messageHistoryVO: p,
        messageTypeEnum: "SINGLE_CHAT_FILE"
      });
      this.msgList.push(p);
    },

    //监听左侧人员选择改变
    handleChattingUserSelect(item) {
      this.currentChattingUser = item.bh;
      this.msgList = [];
      this.msg = "";
      this.createWsConnection();
    },

    //聊天框中附件下载
    handleAttachDownload(item) {
      console.log("item:", item);
      if (item.senderId != this.currentUser) {
        window.location = `${this.baseURL}/minIoController/downloadFile?bh=${item.sysAnnex.bh}`;
      }
    },

    // 获取人员列表
    async getUserListAsync() {
      let resp = await getUserList({});
      if (resp.status == "200") {
        let chattingIdList = [];
        resp.data.forEach(item => {
          if (this.currentUser != item.bh) {
            chattingIdList.push(item.bh);
          }
        });
        this.chattingIdList = chattingIdList;
        this.userList = resp.data.map(i => {
          i.count = 0;
          return i;
        });
      }
    }
  }
};
</script>
<style scoped>
.main-body {
  /* margin-left: 30%; */
  width: 900px;
  margin: 0 auto;
}
.chatting-head {
  display: inline-block;
  padding-top: 20px;
}
.chooseUser {
  width: 200px;
  display: inline-block;
}
.chat-area {
  width: 500px;
}

.chatting-body {
  padding-top: 50px;
}

.chatting-list {
  text-align: center;
  width: 100%;
  font-size: 20px;
  background-color: rgb(17, 59, 125);
  color: #fff;
  line-height: 50px;
}

.chatting-users {
  background: #fff;
  vertical-align: top;
  display: inline-block;
  border: 1px solid #e8e8e8;
  border-radius: 10px;
  width: 200px;
  height: 600px;
}

.chatting-users ul {
  display: inline;
}
.chatting-users ul li {
  width: 100%;
  line-height: 35px;
  text-align: center;
  padding: 5px;
  border-bottom: 1px solid #dcdfe6;
  cursor: pointer;
  font-size: 16px;
}
.chatting-users ul li span {
  float: right;
  width: 20px;
  line-height: 20px;
  margin: 7px 10px 7px;
  border-radius: 50%;
  background: red;
  color: #fff;
  font-size: 12px;
}
.chatting-msg {
  background: #fff;
  vertical-align: top;
  position: relative;
  display: inline-block;
}
.chatting-msg .main-msg {
  border: 1px solid #dcdfe6;
  border-radius: 8px;
}
.chatting-msg .main-msg li {
  width: 600px;
  /* height: 60px; */
  font-size: 20px;
  margin: 10px 0;
  display: table;
}

.chatting-msg .main-msg li span {
  margin: 3px 5px;
  background: aliceblue;
  font-size: 15px;
  line-height: 25px;
  border-radius: 5px;
  word-break: break-all;
  display: block;
}

.chatting-msg .chat-input {
  height: 85px;
  width: 600px;
  border-radius: 10px;
}
.sendMsg {
  position: absolute;
  bottom: 10px;
  right: 5px;
}
.msgFromMe {
  text-align: right;
  padding-right: 10px;
}
.msgFromMe span {
  max-width: 80%;
  width: fit-content;
  float: right;
  text-align: left;
}
.msgFromOthers {
  text-align: left;
  padding-left: 10px;
}

.msgFromOthers span {
  max-width: 80%;
  width: fit-content;
  min-height: 60px;
  height: fit-content;
}
.isChatting {
  background-color: #e6a23c;
  color: #fff;
}
.chat-attach {
  line-height: 30px;
  margin-left: 10px;
  cursor: pointer;
  width: 80px;
}
.chatArea {
  border: 1px solid #dcdfe6;
  border-radius: 5px;
}
</style>

