<template>
  <div class="swiper-cars">
    <swiper :options="swiperOption" v-if="haveData" ref="mySwiper"
            :class="{'swiper-no-swiping': cars.slice(0, returnLen).length === 1}">
      <swiper-slide v-for="(item, i) in cars.slice(0, returnLen)" :key="i">
        <ProductCar :proData="cars.slice(i * 6, (i + 1) * 6)"/>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script>
import ProductCar from '@/components/larger/product-car';

export default {
  name: 'index',
  components: {
    ProductCar
  },
  data () {
    return {
      haveData: true,
      swiperOption: {
        spaceBetween: 0, // 每一个slide之间-间
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        },
        // loop: true,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false
        }
      }
    };
  },
  props: {
    cars: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    cars () {
      // 由于swiper数据变化，不会重新初始化，所以需要手动渲染一次；
      this.haveData = false;
      this.$nextTick(() => {
        this.haveData = true;
      });
    }
  },
  computed: {
    returnLen () {
      return Math.ceil(this.cars.length / 6);
    },
    swiper () {
      return this.$refs.mySwiper.swiper;
    }
  }
};
</script>

<style scoped lang="scss">
  .swiper-cars {
    height: 100%;

    .swiper-container {
      height: 100%;
    }
  }
</style>
