<template>
  <section class="global-part product">
    <div class="flex top">
      <div class="left animated bounceInLeft" :class="{bounceOutLeft: lever}">
        <NumberBlock v-for="(item, i) in Object.keys(factoryMap)"
                     :key="i"
                     class="run-num-block"
                     :class="{'run-num-block1': i === 0, opa: factoryMap[item].num === 0}"
                     :blockTitle="(i === 0) && `生产车辆统计` || ''"
                     :blockFont="(i === 0) && `product-1` || ''"
        >
          <div class="run-num">
            <RunNum
              :theme="1"
              :runData="factoryMap[item]"
            />
          </div>
        </NumberBlock>
      </div>
      <div class="mid animated zoomIn" :class="{zoomOut: lever}">
        <Map :animation="stopAnimate" :mapData="mapData" :themeOption="themeOption"/>
        <ProductFactory :mapData="factoryMap" :isAdd="isAdd"/>
        <div class="day-factory-num">
          <RunNum
            :runData="dayCarNum"
          />
        </div>
      </div>
      <div class="right animated bounceInRight" :class="{bounceOutRight: lever}">
        <NumberBlock class="run-num-block run-num-block2"
                     :theme="2"
                     :blockTitle="`生产信息`"
                     :blockFont="`product-3`"
        >
          <div class="run-num-info">
            <InfoLine :theme="1" :infoLineData="infoLineData" :isActived="isActived"/>
          </div>
        </NumberBlock>
      </div>
    </div>
    <div class="btm animated bounceInUp" :class="{bounceOutDown: lever}">
      <NumberBlock class="run-num-block run-num-block3"
                   :theme="7"
                   :blockTitle="`各品牌车辆生产统计`"
                   :blockFont="`logo`"
      >
        <SwiperCars :cars="proData"/>
      </NumberBlock>
    </div>
  </section>
</template>

<script>
import GetProductServices from '@/services/display/getProduct';
import { FACTORY_MAP, BRAND_MAP } from '@/services/common';
import { mapGetters } from 'vuex';
import Map from '@/components/larger/echarts/map';
import ProductFactory from '@/components/larger/product-factory';

export default {
  name: 'product',
  components: {
    Map,
    ProductFactory
  },
  data () {
    return {
      mapData: {
        '北京': 0,
        '河北': 0,
        '山东': 0,
        '广东': 0
      },
      themeOption: {
        scatterShow: false
      },
      dayCarNum: {
        title: '今日生产:',
        num: 0,
        line: true,
        big: true
      },
      factoryMap: {
        BJ: {
          title: '北京厂区',
          num: 0,
          cNum: 0
        },
        SD: {
          title: '山东厂区',
          num: 0,
          cNum: 0
        },
        GD: {
          title: '广东厂区',
          num: 0,
          cNum: 0
        },
        HB: {
          title: '河北厂区',
          num: 0,
          cNum: 0
        }
      },
      infoLineData: [
        // {
        //   time: '',
        //   type: 0,
        //   title: ''
        // }
      ],
      proData: [],
      lever: false,
      startTimer: null,
      isAdd: '',
      isActived: false,
      cachePage: {} // 缓存数据
    };
  },
  computed: {
    ...mapGetters([
      'getPaths',
      'currentPageBrand',
      'getMenuList',
      'getWebsocket_new_product'
    ]),
    stopAnimate () {
      return this.getPaths.indexOf(this.$route.name) === -1 ? Boolean(true) : Boolean(false);
    }
  },
  watch: {
    getMenuList () {
      this.getData();
      this.token = this.currentPageBrand.token;
    },
    getWebsocket_new_product () { // websocket生产新车
      let getWebsocketNewProduct = JSON.parse(this.getWebsocket_new_product);
      if (!getWebsocketNewProduct || !getWebsocketNewProduct.data || !getWebsocketNewProduct.data.length) return false;
      let _self = this;
      // 根据车型接受数据
      getWebsocketNewProduct.data = getWebsocketNewProduct.data.filter(ele => {
        return this.currentPageBrand.name === BRAND_MAP.ALL ? Boolean(true) : ele.carBrandName ===
          this.currentPageBrand.name;
      });
      if (!getWebsocketNewProduct.data.length) return;
      // 如果来新数据了， 那么需要清除定时器，加载新数据
      if (_self.startTimer) {
        clearInterval(this.startTimer);
        _self.startTimer = null;
      }
      let num = 0;
      this.newProductCar(getWebsocketNewProduct.data[num]);
      _self.startTimer = setInterval(() => {
        num++;
        if (num >= getWebsocketNewProduct.data.length) {
          clearInterval(_self.startTimer);
          _self.startTimer = null;
        } else {
          _self.newProductCar(getWebsocketNewProduct.data[num]);
        }
      }, 8000);
    }
  },
  beforeRouteEnter (to, from, next) {
    next((vm) => {
      vm.lever = false;
    });
  },
  beforeRouteLeave (to, from, next) {
    // change animate or not
    if (to.path !== from.path && this.getPaths.indexOf(this.$route.name) === -1) {
      this.$store.commit('UPDATE_RUN_NUM_BOOL', from.name);
    }
    this.lever = true;
    setTimeout(() => {
      next();
    }, 80);
  },
  mounted: function () {
    // this.getData();
  },
  activated: function () {
    console.log('product');
    if (this.token !== this.currentPageBrand.token) {
      this.getData();
      this.token = this.currentPageBrand.token;
    }
    console.log(this.dayCarNum.num);
  },
  deactivated: function () {
    console.log('跳出product');
  },
  methods: {
    getData () {
      if (this.getMenuList.length) {
        this.getProdTop20();
        this.getProdCBrand();
      }
    },
    newProductCar (ele) {
      let _self = this;
      _self.isAdd = '';
      _self.isActived = false;
      _self.$nextTick(() => {
        if (FACTORY_MAP[ele.carBrandName]) {
          _self.dayCarNum.num++; // 今日生产车辆总数
          _self.factoryMap[FACTORY_MAP[ele.carBrandName].factory.split('-')[1]].num++;
          _self.factoryMap[FACTORY_MAP[ele.carBrandName].factory.split('-')[1]].cNum++;
          // +1动效
          _self.isAdd = FACTORY_MAP[ele.carBrandName].factory.split('-')[1];
          _self.proData.forEach(item => {
            if (item.title === ele.carBrandName) {
              item.num++;
              item.cNum++;
            }
          });
          // 今日生产
          _self.dayCarNum = JSON.parse(JSON.stringify(_self.dayCarNum));
          // 四大厂区-生产车辆数
          _self.factoryMap = JSON.parse(JSON.stringify(_self.factoryMap));
          // 生产统计
          _self.proData = JSON.parse(JSON.stringify(_self.proData));
          // 生产信息
          _self.isActived = true;
          _self.infoLineData.unshift({
            time: ele.carBrandName,
            type: FACTORY_MAP[ele.carBrandName].type,
            title: ele.vin
          });
          // 删除最后一条数据
          _self.infoLineData.pop();
        }
      });
    },
    async getProdTop20 () {
      let _self = this;
      let obs = await GetProductServices.getProdTop20();
      obs.subscribe(res => {
        if (res.data.type === 'success') {
          let data = res.data.data;
          let infoLineData = data.splice(0, 10).map(ele => {
            return {
              time: ele.carBrandName,
              type: FACTORY_MAP[ele.carBrandName].type,
              title: ele.vin
            };
          });
          _self.cachePage.getProdTop20 = _self.infoLineData = JSON.parse(JSON.stringify(infoLineData));
        } else {
          if (_self.cachePage.getProdTop20) {
            let data = _self.cachePage.getProdTop20;
            _self.infoLineData = JSON.parse(JSON.stringify(data));
          }
        }
      }, e => console.log(e));
    },
    async getProdCBrand () {
      let _self = this;
      // 按照车型，获取不同接口数据
      if (_self.currentPageBrand.name === BRAND_MAP.ALL) {
        // 车品牌 === 全部
        let obs = await GetProductServices.getProdCBrand();
        obs.subscribe(res => {
          if (res.data.type === 'success') {
            let data = res.data.data;
            this.carBrandsData(data, _self.currentPageBrand, _self.getMenuList, false);
          }
        }, e => console.log(e));
      } else {
        // 车品牌 != 全部
        let obs = await GetProductServices.getProdCType();
        obs.subscribe(res => {
          if (res.data.type === 'success') {
            let data = res.data.data;
            // 修改车型导航数据为map格式: {'全部': {}, '欧曼': {}}
            let menuList = {};
            _self.getMenuList.forEach(ele => (menuList[ele.name] = ele));
            // 获取对应车型导航下的child属性列表[]
            let menuListArr = menuList[_self.currentPageBrand.name].child;
            this.carBrandsData(data, this.currentPageBrand, menuListArr, true);
          }
        }, e => console.log(e));
      }
    },
    carBrandsData (resData = [], currentBand, bandList, boolAll) {
      let proData = [];
      let newResData = {};
      let dayCarLength = 0;
      let factory = {
        BJ: {
          title: '北京厂区',
          num: 0,
          cNum: 0
        },
        SD: {
          title: '山东厂区',
          num: 0,
          cNum: 0
        },
        GD: {
          title: '广东厂区',
          num: 0,
          cNum: 0
        },
        HB: {
          title: '河北厂区',
          num: 0,
          cNum: 0
        }
      };
      resData.forEach(item => {
        if (!boolAll) {
          newResData[item.brand_name] = item;
        } else {
          newResData[item.type_name] = item;
        }
      });
      // 按车型导航-计算-生产统计-展示的数据条数
      bandList.forEach(ele => {
        if (ele.name !== BRAND_MAP.ALL) {
          let name = !boolAll ? ele.name : currentBand.name;
          // console.log(name);
          let dayCount = newResData[ele.name] ? newResData[ele.name].day_count : 0;
          let monthCount = newResData[ele.name] ? newResData[ele.name].month_count : 0;
          dayCarLength += dayCount; // 今日生产车辆总数
          // factory = {BJ: {num: 0, cNum: 0}, SD: [], GD: [], HB: []};
          factory[FACTORY_MAP[name].factory.split('-')[1]].num += dayCount;
          factory[FACTORY_MAP[name].factory.split('-')[1]].cNum += monthCount;
          proData.push({
            icon: FACTORY_MAP[name].imgUrl,
            title: ele.name,
            num: dayCount,
            cNum: monthCount
          });
        }
      });
      // 赋值----------
      // 今日生产
      this.dayCarNum.num = dayCarLength;
      this.dayCarNum = JSON.parse(JSON.stringify(this.dayCarNum));
      // 四大厂区-生产车辆数
      this.factoryMap = JSON.parse(JSON.stringify(factory));
      // 生产统计
      this.proData = JSON.parse(JSON.stringify(proData));
    }
  }
};
</script>

<style scoped lang="scss">
  .product {
    .top {
      .left {
        padding-top: 40px;
        width: 354px;

        .run-num-block {
          width: 100%;
          height: 135px;
          margin-bottom: 15px;
        }

        .run-num-block1 {
          height: 165px;
        }

        .opa {
          opacity: .5;
        }
      }

      .mid {
        flex: 1;
        padding-top: 30px;
        height: 720px;
        position: relative;

        .day-factory-num {
          position: absolute;
          left: 5%;
          top: 5%;
        }
      }

      .right {
        padding-top: 40px;
        width: 374px;

        .run-num-block2 {
          height: 595px;
        }

        .run-num-info {
          height: 100%;
          padding: 35px 0 35px 20px;
        }
      }
    }

    .btm {
      .run-num-block3 {
        width: 100%;
        height: 185px;
      }
    }
  }
</style>
