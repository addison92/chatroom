<template>
  <div id="mytitle">
    <title-button type="min"></title-button>
    <title-button type="max"></title-button>
    <title-button type="close"></title-button>
  </div>
</template>

<script>
import titleButton from "@/components/titlebar/titleButton";
export default {
  name: "toolsBar",
  components: {
    titleButton
  }
};
</script>

<style>
#mytitle {
  position: absolute;
  width: 100%;
  height: 25px;
  /* height: 68px; */
  color: black;
  right: 0;
  -webkit-app-region: drag;
  z-index: 2001;
}
</style>