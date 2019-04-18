<template>
  <h2>
    <i class="title-icon-font" :class="['svg-font', font]" v-if="!icon" v-show="showFont">我</i>
    <i v-if="icon" class="title-icon" v-show="showFont" :style="`backgroundImage: url(${icon})`"></i>
    <span>{{ title }}</span>
  </h2>
</template>

<script>
export default {
  name: 'block-title',
  props: {
    showFont: {
      type: Boolean,
      default: true
    },
    font: {
      type: String,
      default: 'logistics-4'
    },
    title: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    }
  }
};
</script>

<style scoped lang="scss">
  .svg-font {
    color: #71c2d6;
    font-size: 24px;
  }
  h2 {
    display: flex;
    flex-direction: row;
    align-items: center;
    font-weight: 400;
    padding: 0 0 5px 0;
    i {
      margin-right: 16px;
    }
    .title-icon-font {
      font-size: 22px;
    }
    .title-icon {
      display: inline-block;
      width: 26px;
      height: 26px;
      margin: 2px 6px 0 0;
      background-image: none;
      background-size: 100% 100%;
    }
    span {
      color: #fff;
      font-size: 18px;
    }
  }
</style>
