<template>
  <div class="logistic-list-wrapper">
    <NumberBlock
      class="logistic-list-wrapper"
      :blockTitle="blockTitle"
      :blockFont="blockFont"
      :icon="icon"
      :theme="10"
    >
      <div class="logistic-list flex justify-align-center">
        <InfoLine :theme="0" :infoLineData="swiperLine" :isActived="isActived"/>
      </div>
    </NumberBlock>
  </div>
</template>

<script>
export default {
  name: 'logistic-list',
  props: {
    blockTitle: {
      type: String,
      default: ''
    },
    blockFont: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    },
    swiperLine: {
      type: Array,
      default: () => []
    },
    isActived: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
    };
  }
};
</script>

<style scoped lang="scss">
  .logistic-list {
    height: 100%;
    padding: 20px 0;
  }
  .logistic-list-wrapper {
    height: 100%;
  }
</style>
