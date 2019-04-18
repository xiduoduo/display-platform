<template>
  <chart class="my-map" @click="goCity" ref="mapChart" :options="options" :auto-resize="true"></chart>
</template>

<script>
/**
 * mapData: [{
 *     name: '北京',
 *     value: 122
 * }]
 */
import scatter from '@/assets/img/scatter.png';
import planePath from './img/indexmap.png';
// import pathUrl1 from './img/cityMap.png';
import pathUrl2 from './img/fotonSmall.png';
import newCity from './js/echarts-map-config';
export default {
  name: 'index',
  data () {
    return {
      options: {},
      city: [
        {
          name: '北京',
          val: 'beijing'
        }, {
          name: '天津',
          val: 'tianjin'
        }, {
          name: '上海',
          val: 'shanghai'
        }, {
          name: '重庆',
          val: 'chongqing'
        }, {
          name: '河北',
          val: 'hebei'
        }, {
          name: '河南',
          val: 'henan'
        }, {
          name: '云南',
          val: 'yunnan'
        }, {
          name: '宁夏',
          val: 'ningxia'
        }, {
          name: '辽宁',
          val: 'liaoning'
        }, {
          name: '黑龙江',
          val: 'heilongjiang'
        }, {
          name: '湖南',
          val: 'hunan'
        }, {
          name: '安徽',
          val: 'anhui'
        }, {
          name: '山东',
          val: 'shandong'
        }, {
          name: '新疆',
          val: 'xinjiang'
        }, {
          name: '江苏',
          val: 'jiangsu'
        }, {
          name: '浙江',
          val: 'zhejiang'
        }, {
          name: '江西',
          val: 'jiangxi'
        }, {
          name: '湖北',
          val: 'hubei'
        }, {
          name: '广西',
          val: 'guangxi'
        }, {
          name: '甘肃',
          val: 'gansu'
        }, {
          name: '山西',
          val: 'shanxi'
        }, {
          name: '内蒙古',
          val: 'neimenggu'
        }, {
          name: '陕西',
          val: 'shanxi1'
        }, {
          name: '吉林',
          val: 'jilin'
        }, {
          name: '福建',
          val: 'fujian'
        }, {
          name: '贵州',
          val: 'guizhou'
        }, {
          name: '广东',
          val: 'guangdong'
        }, {
          name: '青海',
          val: 'qinghai'
        }, {
          name: '西藏',
          val: 'xizang'
        }, {
          name: '四川',
          val: 'sichuan'
        }, {
          name: '海南',
          val: 'hainan'
        }, {
          name: '台湾',
          val: 'taiwan'
        }, {
          name: '香港',
          val: 'xianggang'
        }, {
          name: '澳门',
          val: 'aomen'
        }],
      cityData: {},
      cityChangeData: {},
      newThemeOption: {}
    };
  },
  props: {
    mapData: {
      type: Object,
      default: () => ({})
    },
    themeOption: {
      type: Object,
      default: () => ({})
    },
    cityMapData: {
      type: Object,
      default: () => ({})
    },
    type: {
      type: Boolean,
      default: false
    },
    animation: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    mapData () {
      this.setOptions();
    },
    cityMapData () {
      this.setOptions();
    },
    animation () { // 监测数据变化，重新渲染echarts
      this.setOptions();
    }
  },
  methods: {
    goCity (param) {
      if (!Object.keys(this.cityMapData).length) return;
      // 点击->切换全国/各自省份
      let index = this.city.findIndex(ele => ele.name === param.name);
      if (index !== -1) {
        this.cityData = this.cityChangeData[this.city[index].name];
        this.setOptions(this.city[index].val);
      } else {
        this.setOptions();
      }
    },
    setCityMapData () {
      let regCityMaps = {};
      for (let item in this.cityMapData) {
        let name = this.convertProvinceName(item);
        regCityMaps[name] = this.cityMapData[item];
      }
      this.cityChangeData = regCityMaps;
    },
    getCp (mapName) {
      // 保存经纬度{'北京': [log, lan]...};
      let mapJson = {};
      let geoCoordMap = {};
      if (mapName === 'china') {
        mapJson = require(`@/assets/json/china`);
      } else {
        mapJson = require(`@/assets/json/province/${mapName}`);
      }
      mapJson.features.map(ele => {
        if (ele.properties.cp) {
          // 地区名称
          let name = ele.properties.name;
          // 地区经纬度
          geoCoordMap[name] = ele.properties.cp;
        }
      });
      return geoCoordMap;
    },
    convertProvinceName (cityName) {
      // 改省份名
      return cityName.replace(/[省|市|自治区|壮族自治区|回族自治区|维吾尔自治区|特别行政区]/g, '');
    },
    changeData (data) {
      // 整理数据
      let arr = [];
      for (let item in data) {
        arr.push({
          name: item,
          value: data[item]
        });
      }
      return arr;
    },
    dataFactory (mapName) {
      // 合并经纬度，整理数据
      let geoCoordMap = this.getCp(mapName);
      let data = mapName === 'china' ? this.changeData(this.mapData) : this.changeData(this.cityData);
      return data.map(ele => {
        ele.name = newCity(ele.name);
        let name = mapName === 'china' ? this.convertProvinceName(ele.name) : ele.name;
        let val = geoCoordMap[name] ? geoCoordMap[name] : [];
        // 暂时去掉台湾数据了
        if (name === '台湾') {
          val = [];
        }
        return {
          name: name,
          value: val.concat(ele.value)
        };
      });
    },
    setOptions (mapName = 'china') {
      // 初始化
      this.newThemeOption = Object.assign({
        pointPng: scatter,
        geoItemStyleAreaColor: 'rgba(13, 58, 119, .6)',
        geoItemStyleBorderColor: '#1580CA',
        geoItemStyleEmphasisAreaColor: '#1a82db',
        labelColor: '#4ec2db',
        effectLabelColor: '#24AACF',
        effectItemColor: '#24AACF',
        scatterLabelColor: '#fff',
        scatterShow: true
      }, this.themeOption);
      // 更改数据，增加经纬度[80.1, 135.3, value]
      if (this.cityMapData) {
        this.setCityMapData();
      }
      let mapLoation = {
        zoom: 1.1,
        left: 'center',
        top: 'center'
      };
      if (mapName === 'hainan') {
        mapLoation.zoom = 6.5;
        mapLoation.top = '230%';
        mapLoation.left = '100%';
      }
      let mapData = this.dataFactory(mapName);
      let series = this.getSeries(mapName, mapData, mapLoation);
      let label = {};
      if (this.type) {
        label = {
          normal: {
            show: true,
            textStyle: {
              color: this.newThemeOption.labelColor,
              fontSize: 12
            },
            z: 2
          },
          emphasis: {
            show: true,
            textStyle: {
              color: this.newThemeOption.labelColor,
              fontSize: 12
            }
          }
        };
      }
      this.options = {
        animation: this.animation,
        geo: {
          // aspectScale: 0.8,
          zoom: mapLoation.zoom,
          top: mapLoation.top,
          left: mapLoation.left,
          map: mapName,
          itemStyle: {
            normal: {
              areaColor: this.newThemeOption.geoItemStyleAreaColor,
              borderColor: this.newThemeOption.geoItemStyleBorderColor,
              borderWidth: 2
            },
            emphasis: {
              areaColor: this.newThemeOption.geoItemStyleEmphasisAreaColor
            }
          },
          label
        },
        series
      };
    },
    getSeries (mapName, mapData, mapLoation) {
      let series = [];
      if (!this.type) {
        series = [
          // 常规地图
          {
            // aspectScale: 0.8,
            zoom: mapLoation.zoom,
            top: mapLoation.top,
            left: mapLoation.left,
            type: 'map',
            mapType: mapName,
            itemStyle: {
              normal: {
                areaColor: 'rgba(13, 58, 119, .1)',
                opacity: 0.1,
                // borderColor: '#1580CA',
                borderWidth: 2
              },
              emphasis: {
                areaColor: '#1a82db'
              }
            },
            emphasis: {
              label: {
                show: false
              }
            },
            data: this.city
          },
          // 区域散点图
          {
            type: 'effectScatter',
            coordinateSystem: 'geo',
            label: {
              backgroundColor: 'transparent',
              show: true,
              position: 'bottom',
              formatter: '{b}',
              color: this.newThemeOption.effectItemColor
            },
            rippleEffect: {
              period: 3,
              scale: 4,
              brushType: 'stroke'
            },
            symbolSize: 4,
            itemStyle: {
              color: this.newThemeOption.effectLabelColor
            },
            data: mapData
          },
          {
            name: '点',
            type: 'scatter',
            zlevel: 3,
            coordinateSystem: 'geo',
            symbol: `image://${this.newThemeOption.pointPng}`,
            symbolSize: function (val) {
              let w = (val[2] + '').length * 11;
              w = Math.max(w, 32);
              return [w, 28];
            },
            symbolOffset: [0, -12],
            itemStyle: {
              opacity: this.newThemeOption.scatterShow ? 1 : 0
            },
            label: {
              show: true,
              color: this.newThemeOption.scatterLabelColor, // 气泡内数值颜色
              fontSize: 12,
              offset: [0, -2],
              align: 'center',
              formatter: (a) => {
                return a.value[2];
              }
            },
            data: mapData
          }
        ];
      } else {
        let BJData = [];
        // 合并经纬度，整理数据
        let geoCoordMap = this.getCp(mapName);
        for (var i in this.mapData) {
          var obj = {name: this.convertProvinceName(i), value: this.mapData[i]};
          var arr = [obj, {name: '北京'}];
          BJData.push(arr);
        }
        [['北京', BJData]].forEach((item, i) => {
          series.push(
            {
              name: item[0],
              type: 'lines',
              zlevel: 2,
              symbol: ['none', 'arrow'],
              symbolSize: 10,
              effect: {
                show: true,
                period: 1.5,
                constantSpeed: 200,
                trailLength: 0,
                symbol: `image://${planePath}`,
                symbolSize: 15
              },
              lineStyle: {
                normal: {
                  color: '#fff',
                  width: 1,
                  opacity: 0.6,
                  curveness: 0.2
                }
              },
              data: this.convertData(item[1], geoCoordMap)
            }, {
              name: item[0],
              type: 'effectScatter',
              coordinateSystem: 'geo',
              zlevel: 2,
              rippleEffect: {
                brushType: 'stroke',
                scale: 8,
                period: 3
              },
              itemStyle: {
                normal: {
                  color: 'rgba(255, 255, 255, .2)',
                  shadowBlur: 80,
                  shadowColor: 'rgba(255, 255, 255, 1)'
                }
              },
              data: item[1].map((dataItem) => {
                return {
                  name: dataItem[1].name,
                  value: geoCoordMap[dataItem[1].name].concat([dataItem[1].value])
                };
              })
            }, {
              type: 'scatter',
              coordinateSystem: 'geo',
              zlevel: 10,
              symbol: `image://${pathUrl2}`,
              symbolSize: 45,
              data: item[1].map((dataItem) => {
                return {
                  name: dataItem[1].name,
                  value: geoCoordMap[dataItem[1].name].concat([dataItem[1].value])
                };
              })
            });
        });
      }
      return series;
    },
    convertData (data, geoCoordMap) {
      let res = [];
      for (let i = 0; i < data.length; i++) {
        var dataItem = data[i];
        var fromCoord = geoCoordMap[dataItem[0].name];
        var toCoord = geoCoordMap[dataItem[1].name];
        if (fromCoord && toCoord) {
          res.push([{
            coord: fromCoord,
            value: dataItem[0].value // 来源或流向修改
          }, {
            coord: toCoord
          }]);
        }
      }
      return res;
    }
  },
  mounted: function () {
    this.setOptions();
  }
};
</script>

<style scoped lang="scss">
  .my-map {
    width: 100%;
    height: 100%;
  }
</style>
