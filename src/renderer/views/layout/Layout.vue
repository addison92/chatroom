<template>
  <div class="app-wrapper">
    <sidebar class="sidebar-container" @mouseover.native="handleMouseover" @mouseout.native="handleMouseout"></sidebar>
    <div class="main-container">
      <navbar></navbar>
      <app-main></app-main>
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain } from './components'
import ResizeMixin from './mixin/ResizeHandler'

export default {
  name: 'layout',
  data() {
    return {
      hadMouseOut: false
    }
  },
  components: {
    Navbar,
    Sidebar,
    AppMain
  },
  mixins: [ResizeMixin],
  computed: {
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('CloseSideBar', { withoutAnimation: false })
    },

    handleMouseover() {
      if(this.$store.state.hadMouseOut) {
        this.$store.dispatch('OpenSideBar', { withoutAnimation: false })
      }
    },

    handleMouseout() {
      this.hadMouseOut = true;
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "../../styles/mixin.scss";
  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }
</style>
