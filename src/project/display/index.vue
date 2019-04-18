<template>
  <section class="main">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
  </section>
</template>

<script>
export default {
  name: 'index',
  activated: function () {
    // console.log('缓存');
  },
  deactivated: function () {
    // console.log('跳出缓存');
  }
};
</script>

<style scoped lang="scss">
  .main {
    height: calc(100% - 100px);
  }
</style>
