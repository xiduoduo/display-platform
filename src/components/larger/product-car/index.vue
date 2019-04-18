<template>
  <div class="product-car">
    <ul class="car-list flex justify-center">
      <li v-for="(item, i) in proData" :key="i" class="car-list-item flex justify-align-center">
        <span class="car-list-img" :style="`backgroundImage: url(${item.icon})`"></span>
        <RunNum :runData="runData[i]" :theme="3"/>
      </li>
    </ul>
  </div>
</template>

<script>
/**
 * proData: [
 *  {
 *      icon: 'url', // 图片路径
 *      title: '',
 *      num: 0,
 *      cNum: 0
 *  }
 * ]
 */
export default {
  name: 'index',
  props: {
    proData: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    runData () {
      return this.proData.map(ele => {
        return {
          title: ele.title,
          num: ele.num,
          cNum: ele.cNum
        };
      });
    }
  }
};
</script>

<style scoped lang="scss">
  .product-car {
    height: 100%;
    .car-list {
      height: 100%;
      .car-list-item {
        position: relative;
        width: 16.8%;
        height: 100%;
        &::before {
          position: absolute;
          right: 0;
          top: 25%;
          content: '';
          width: 1px;
          height: 50%;
          background: rgba(255,255,255,.6);
        }
        &:nth-last-child(1) {
          &::before {
            display: none;
          }
        }
      }
      .car-list-img {
        margin-right: 15px;
        width: 82px;
        height: 56px;
      }
    }
  }
</style>
