<template>
  <div class="titlebtn" :style="style" @click="handleClick">
    <i :class="icon" style="color:block;cursor:pointer"></i>
  </div>
</template>
<script>
const { ipcRenderer: ipc } = require("electron");
const style = {
  min: {
    right: "65px"
  },
  max: {
    right: "40px"
  },
  close: {
    right: "15px"
  }
};

const style_icon = {
  min: "el-icon-minus",
  max: "el-icon-copy-document",
  close: "el-icon-close"
};
export default {
  name: "titleBtn",
  props: ["type"],
  computed: {
    style: function() {
      return style[this.type];
    },
    icon: function() {
      return style_icon[this.type];
    }
  },
  methods: {
    handleClick: function() {
      ipc.send(this.type);
    }
  }
};
</script>

<style>
.titlebtn {
  position: absolute;
  top: 10px;
  width: 20px;
  height: 20px;
  -webkit-app-region: no-drag;
}
</style>


