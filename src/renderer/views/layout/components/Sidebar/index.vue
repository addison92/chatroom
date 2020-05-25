<template>
  <el-scrollbar wrapClass="scrollbar-wrapper">
    <el-menu
      mode="vertical"
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="false"
      background-color="#fffff"
      text-color="#333333"
      active-text-color="#2f89ff"
    >
      <sidebar-item :routes="routes"></sidebar-item>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import Layout from "@/views/layout/Layout";
import SidebarItem from "./SidebarItem";
import { mapGetters } from "vuex";

export default {
  components: {
    SidebarItem
  },
  computed: {
    ...mapGetters(["sidebarIdList"]),
    routes() {
      let sidebarIdList = this.sidebarIdList;

      let fixMenus = [];

      return fixMenus;
    },
    isCollapse() {
      return !this.sidebar.opened;
    }
  },
  methods: {
    isUrlContained(code) {
      return this.sidebarIdList.indexOf(code) != -1;
    }
  }
};
</script>