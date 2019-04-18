<template>
  <section
    class="layout-bg"
    :class="{'layout-green': $route.query.theme === 'green'}"
    :style="`backgroundImage: url(${bgImg || layoutBg})`">
    <slot></slot>
  </section>
</template>

<script>
import layoutBg from '@/assets/img/layout_bg.png';

export default {
  name: 'index',
  data () {
    return {
      layoutBg
    };
  },
  props: {
    bgImg: {
      type: String,
      default: ''
    }
  }
};
</script>

<style scoped lang="scss">
  .layout-bg {
    height: 100%;
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }
  .layout-green {
    background-position: left bottom;
    background-size: 100% auto;
  }
</style>
