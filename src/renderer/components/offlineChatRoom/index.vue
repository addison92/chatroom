<template>
  <div>
    <div class="message clearfix" v-show="chatRoomVisible">
      <div class="messageLeft pull-left">
        <div class="peopleMessage">
          <!-- <span class="el-icon-picture peopleIconBig"></span> -->
          <img
            :src="project_prefix+'static/images/message/imageIconBig.png'"
            alt="默认头像"
            class="peopleIconBig"
          />
          <!-- <img src="" alt="默认头像"> -->
          <p>{{userName}}</p>
        </div>
        <ul class="distoryMessageList">
          <li
            v-for="(item, index) in chattingList"
            :key="index"
            @click="handleLeftPersonMenuSelect(item)"
            :class="currentChattingPerson.bh == item.bh?'highligt-user':''"
          >
            <span class="peopleIconSmall">
              <img :src="project_prefix+'static/images/message/imageIconSamll.png'" alt="默认头像" />
              <!-- <i v-if="item.online =='1'" class="el-icon-success online"></i> -->
            </span>
            <span class="name">{{item.name}}</span>
            <span class="el-icon-close pull-right hide" @click.stop="onChatPersonClose(item)"></span>
            <span class="numberTip" v-if="item.count&&item.count>0">{{item.count}}</span>
          </li>
        </ul>
      </div>
      <div class="messageCenter pull-left">
        <div class="messageCenterHead">
          {{currentChattingPerson.name}}
          <!-- <span
            class="status"
          >{{currentChattingPerson.online =='1'?'执勤中':''}}</span> -->
          <span class="el-icon-minus pull-right" @click="chatRoomVisible = false"></span>
        </div>
        <div class="messageCenterLeft pull-left">
          <div class="mainMessageSend" id="message-list" @click="reportEditState = false">
            <div
              :class="$store.getters.loginInfo.id != msg.fromUser?'mainMessageSendLeft':'mainMessageSendRight'"
              v-for="(msg, index) in chatMsgList"
              :key="index"
            >
              <p>{{msg.time}}</p>
              <img :src="project_prefix+'static/images/message/imageContactSamll.png'" alt="默认头像" />
              <div class="charts">
                <span
                  class="chartContentName"
                >{{msg.fromUser == $store.getters.loginInfo.id ?$store.getters.loginInfo.xm: currentChattingPerson.name}}</span>
                <div class="chartContent">
                  <div class="triangle"></div>
                  <div class="chart">{{msg.message}}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="mainMessageSendBottom">
            <div class="moreButton clearfix">
              <!-- <el-button
                class="pull-left bigIcon"
                icon="el-icon-edit-outline"
                @click="handleReportChoose"
                title="报文拟制"
              ></el-button>-->
              <el-button
                class="pull-right bigIcon"
                icon="el-icon-time"
                :disabled="!currentChattingPerson.bh"
                @click="handleHistoryMessageClick"
                :plain="true"
                title="查看消息记录"
              >
                <span style="font-size:14px;">消息记录</span>
              </el-button>
            </div>
            <textarea
              name
              id
              rows="2"
              placeholder="请输入要发送的内容"
              class="messageContent"
              v-model="content"
              @keyup.enter="sendMsg"
            ></textarea>

            <div class="sendButtonGroup clearfix">
              <el-dropdown class="pull-right">
                <span class="el-dropdown-link">
                  {{currentSendType=='1'?'4G网络':'北斗报文'}}
                  <i
                    class="el-icon-caret-bottom el-icon--right"
                  ></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="goOnline">4G网络</el-dropdown-item>
                  <el-dropdown-item>北斗报文</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-button class="pull-right sendButton" @click="sendMsg">发送</el-button>
            </div>
          </div>
        </div>
        <div class="messageCenterRight pull-right" v-show="!historyToggle">
          <h3>通讯录</h3>
          <el-tree
            :data="addressList"
            :props="propsConfig"
            @node-click="handleNodeClick"
            class="address-tree"
          >
            <span class="custom-tree-node" style="position:relative;" slot-scope="{node,data}">
              <span>{{node.label}}</span>
              <!-- <i
                v-if="data.type !='0'"
                :class="data.online == '1'?'user-online':'user-offline'"
              >{{data.online == '1'?'在线':'离线'}}</i> -->
            </span>
          </el-tree>
        </div>
        <div class="messageCenterRight historyMessage pull-right" v-show="historyToggle">
          <h6 class="historyMessageTitle">
            历史记录
            <span class="el-icon-close" @click="handleHistoryMessageClose"></span>
          </h6>
          <div class="historyMessageMain">
            <div
              :class="$store.getters.loginInfo.id!=msg.fromUser?'mainMessageSendLeft':'mainMessageSendRight'"
              v-for="(msg, index) in chatMsgList"
              :key="index"
            >
              <img :src="project_prefix+'static/images/message/imageContactSamll.png'" alt="默认头像" />
              <div class="charts">
                <span
                  class="chartContentName"
                >{{msg.fromUser == $store.getters.loginInfo.id ? $store.getters.loginInfo.xm : currentChattingPerson.name}}</span>
                <div class="chartContent">
                  <div class="triangle"></div>
                  <div class="chart" slot="reference">{{msg.message}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <img
      v-show="!chatRoomVisible"
      @click="chatRoomVisible = true"
      :src="project_prefix+'static/images/message/chat-room.png'"
      alt
      class="chat-img-offline"
    />
  </div>
</template>

<script>
import "@/utils/toDate";
import { toTree } from "@/utils/index";
import { getTxlListById, saveHistoryMsg, getHistoryMsgById } from "@/utils/db";
import { receiveInfo, sendInfo } from "@/api/offlineChatRoom/index";
import { mapActions, mapGetters } from "vuex";

export default {
  data() {
    return {
      project_prefix: "",
      addressList: [],
      currentDept: "",
      chattingIdList: [],
      chattingList: [],
      chatMsgList: [],
      content: "",
      currentChattingPerson: {},
      currentRoomId: "",
      currentSendType: "0",
      currentSelectedReportId: "",
      historyToggle: false,
      historyMessageList: [],
      chatRoomVisible: false,
      Day_Of_A_Month_Ago: "",
      BaseUrl: this.$store.getters.baseURL,
      propsConfig: {
        children: "children",
        label: "name"
      },
      timer: null
    };
  },
  created() {
    this.userName = this.$store.getters.loginInfo.xm;
    this.getAddressBookListAsync();
  },
  computed: {
    ...mapGetters(["deviceInfo"])
  },
  updated() {
    //消息滚动到底部
    let ele = document.getElementById("message-list");
    ele.scrollTop = ele.scrollHeight;
  },
  methods: {
    goOnline(){
      this.$router.push("/policePlan/xdzs");
    },
    async initChatRoomAsync(receiver) {
      //当前人:this.$store.getters.loginInfo.id
      //聊天对象:receiver.bh

      //通过2个id,获取聊天消息
      let msgs = await getHistoryMsgById({
        sendId: receiver.bh,
        receiveId: `${this.$store.getters.loginInfo.id}`
      });
      this.chatMsgList = msgs;
      // if (this.timer) {
      //   clearInterval(this.timer);
      // } else {
      //   this.timer = setInterval(this.getRemoteMsgAsync, 5000);
      // }
      this.timer = setInterval(this.getRemoteMsgAsync, 5000);
    },

    getOfflineMsgByBh(list) {
      var deviceList = this.deviceInfo;
      var deviceObj = {};
      deviceList.forEach(item => {
        deviceObj[item.bdbh] = item;
      });

      var result = [];

      console.log("deviceObj:", deviceObj);

      list.forEach(record => {
        var senderDevice = deviceObj[record.sendBdBh] || {};
        var receiverDevice = deviceObj[record.receiveBdBh] || {};

        result.push({
          message: record.message,
          sendId: senderDevice.rybh,
          receiveId: receiverDevice.rybh,
          time: record.time,
          fromUser: ""
        });
      });

      return result;
    },

    //轮训获取北斗消息
    async getRemoteMsgAsync() {
      let resp = await receiveInfo();
      //赋值给 this.chatMsgList
      if (resp.status == "200") {
        console.log("chatMsgList:", resp);
        var msgs = this.getOfflineMsgByBh(resp.data);
        this.chatMsgList.push.apply(this.chatMsgList, msgs);
        //保存到本地sqlite
        await saveHistoryMsg(msgs);
      }
    },

    handleNodeClick(data) {
      if (!data.children && data.type != "0") {
        if (!this.$store.getters.devciceBm) {
          this.utils.showToast("当前登录人未绑定设备");
          return;
        }

        var element = data;
        this.currentChattingPerson = element;

        var receiver_bh = this.currentChattingPerson.bh;
        var receiver_bd_device =
          this.deviceInfo.find(d => {
            return d.rybh == receiver_bh;
          }) || {};

        if (!receiver_bd_device.zbbh) {
          this.utils.showToast("当前选择人未绑定设备");
          return;
        }

        var index = this.chattingIdList.indexOf(element.bh);
        if (index == -1) {
          this.chattingIdList.unshift(element.bh);
          this.chattingList.unshift(element);
          element.count = 0;
          this.$set(this.chattingList, index, element);
        } else {
          this.chattingIdList.splice(index, 1);
          this.chattingList.splice(index, 1);

          this.chattingIdList.unshift(element.bh);
          this.chattingList.unshift(element);
        }

        //获取当前人聊天信息
        this.initChatRoomAsync(element);
      }
    },

    onChatPersonClose(item) {
      var index = this.chattingIdList.indexOf(item.bh);

      this.chattingIdList.splice(index, 1);
      this.chattingList.splice(index, 1);

      if (this.chattingIdList.length > 0) {
        this.currentChattingPerson = this.chattingList[0];
        this.initChatRoomAsync(this.chattingList[0]);
      } else {
        this.currentChattingPerson = {};
        this.chattingList = [];
        this.chatMsgList = [];
        clearInterval(this.timer);
      }

      this.handleHistoryMessageClose();
    },

    //左侧人员列表选择
    handleLeftPersonMenuSelect(item) {
      this.currentChattingPerson = item;
      //点击左侧 未读数量清空
      var index = this.chattingIdList.indexOf(item.bh);
      item.count = 0;
      this.$set(this.chattingList, index, item);

      this.initChatRoomAsync(item);
      this.handleHistoryMessageClose();
    },

    sendMsg() {
      if (!this.currentChattingPerson.bh) {
        this.utils.showToast("请先选择人员");
        return;
      }

      if (!this.content) {
        this.utils.showToast("发送消息不能为空");
        return;
      }

      //TODO
      var receiver_bh = this.currentChattingPerson.bh;
      var receiver_bd_device =
        this.deviceInfo.find(d => {
          return d.rybh == receiver_bh;
        }) || {};

      var sender_bd_device =
        this.deviceInfo.find(d => {
          return d.rybh == this.$store.getters.loginInfo.id;
        }) || {};
      console.log("receiver_bd_device:", receiver_bd_device);

      this.sendInfoAsync({
        sendBd: receiver_bd_device.bdbh,
        sendIP: sender_bd_device.bdip,
        sendPort: sender_bd_device.bdpt,
        txt: this.content
      });
    },

    handleHistoryMessageClick() {
      if (!this.historyToggle) {
        this.historyToggle = true;
      } else {
        this.historyToggle = false;
        this.historyMessageList = [];
      }
    },

    handleHistoryMessageClose() {
      this.historyToggle = false;
      this.historyMessageList = [];
    },

    // 通讯录列表
    async getAddressBookListAsync() {
      let resp = await getTxlListById({
        userid: `${this.$store.getters.loginInfo.id}`
      });
      if (resp && resp.length == 1) {
        this.addressList = JSON.parse(resp[0].list);
      }
    },
    async sendInfoAsync(params) {
      let resp = await sendInfo(params);
      if (resp.status == "200") {
        var time = new Date().Format("yyyy-MM-dd hh:mm:ss");
        this.chatMsgList.push({
          sendId: this.currentChattingPerson.bh,
          receiveId: this.$store.getters.loginInfo.id,
          message: params.txt,
          fromUser: this.$store.getters.loginInfo.id,
          time: time
        });

        //存储自己发送的信息 fromUser区分是自己还是别人
        await saveHistoryMsg([
          {
            sendId: this.currentChattingPerson.bh,
            receiveId: `${this.$store.getters.loginInfo.id}`,
            message: params.txt,
            fromUser: `${this.$store.getters.loginInfo.id}`,
            time: time
          }
        ]);

        this.content = "";
      }
    }
  },
  beforeDestroy() {
    clearInterval(this.timer);
  }
};
</script>
<style scoped>
@import "../../styles/realTimeCommunicate.css";
.address-tree {
  height: 520px;
  overflow-x: scroll;
}
.highligt-user {
  background: #2f6bc6;
}
</style>