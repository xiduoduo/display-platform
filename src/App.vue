<template>
  <div id="app" :class="$route.query.theme">
    <router-view></router-view>
  </div>
</template>

<script>
import WebSocketService from '@/services/websocket';
// 生产环境：康明斯不需要webSocket
let devPath = process.env.PROJECT === 'kms';
export default {
  name: 'App',
  mounted () {
    if (!devPath) {
      WebSocketService.start();
    }
  },
  computed: {
  },
  watch: {

  }
};
</script>

<style lang="scss">
  #app {
    height: 100%;
    overflow: hidden;
  }
</style>
