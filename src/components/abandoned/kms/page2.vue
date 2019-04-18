<template>
  <div class="box">
    <div class="left">
      <NumberBlock
        class="run-nums-block"
        :theme="1"
        :blockTitle="'总服务里程（KM）'"
        :icon="iconKm"
      >
        <div class="run-num">
          <RunNum
            :runNumBool="true"
            :runData="{title: '', num: leftMilege}"
          />
        </div>
      </NumberBlock>
      <NumberBlock
        class="run-nums-block"
        :theme="1"
        :blockTitle="'总行驶时长（H）'"
        :icon="iconHours"
      >
        <div class="run-num">
          <RunNum
            :runNumBool="true"
            :runData="{title: '', num: leftRunTime}"
          />
        </div>
      </NumberBlock>
      <div class="fault-top5">
        <h2><i :style="{backgroundImage: `url(${require('@/assets/kms/fault-top5.png')})`}"></i><span>本月常见故障Top5</span></h2>
        <div
          class="fault-chart"
          :style="{backgroundImage: `url(${require('@/assets/kms/monitor-left-2.png')})`}"
        >
          <Pie :setData="faultTop5Data" :animation="Boolean(false)"></Pie>
        </div>
      </div>
    </div>
    <div class="main">
      <div class="map-box">
        <chart
          class="map"
          :class="{'show': activeMapIndex === 0}"
          :options="map0"
          :auto-resize="true"
        ></chart>
        <chart
          class="map"
          :class="{'show': activeMapIndex === 1}"
          :options="map1"
          :auto-resize="true"
        ></chart>
        <chart
          class="map"
          :class="{'show': activeMapIndex === 2}"
          :options="map2"
          :auto-resize="true"
        ></chart>
        <chart
          class="map"
          :class="{'show': activeMapIndex === 3}"
          :options="map3"
          :auto-resize="true"
        ></chart>
        <chart
          class="map"
          :class="{'show': activeMapIndex === 4}"
          :options="map4"
          :auto-resize="true"
        ></chart>
        <chart
          class="map"
          :class="{'show': activeMapIndex === 5}"
          :options="map5"
          :auto-resize="true"
        ></chart>
        <chart
          class="map"
          :class="{'show': activeMapIndex === 6}"
          :options="map6"
          :auto-resize="true"
        ></chart>
      </div>
      <div class="timeline">
        <h3
          class="trans"
          :style="{
            left: singleLeft * activeMapIndex + 'px',
            transitionDuration: durTime
          }"
        >
          {{totalsReverse[activeMapIndex]}}
        </h3>
        <div
          class="linebox"
          ref="lineBox"
        >
          <p class="line-a">
            <span
              class="split"
              v-for="(v, i) in hours"
              :key="i"
              :style="{left: singleLeft * i + 'px'}"
            >
            </span>
          </p>
          <p
            class="line-b"
            ref="lineB"
            :style="{
              width: allDataReady ? singleLeft * (activeMapIndex + 1) + 'px' : 0,
              transitionDuration: '5s'
            }"
          >
          </p>
          <div class="timebox">
            <span
              class="time-str"
              v-for="(v, i) in hours"
              :key="i"
              :style="{left: singleLeft * i + 'px'}"
              @click="changeMap(i)"
            >
              {{v}}
            </span>
          </div>
        </div>
        <p class="tip">（最近24小时数据）</p>
      </div>
    </div>
    <div class="right">
      <NumberBlock
        class="run-nums-block"
        :theme="2"
        :blockTitle="`车辆里程分布区间`"
        :icon="iconBar"
      >
        <div class="online-chart chart">
          <chart
            :options="mileageSectionData"
            :auto-resize="true"
          ></chart>
        </div>
      </NumberBlock>
      <NumberBlock
        class="run-nums-block"
        :theme="2"
        :blockTitle="'车辆月运营率及里程分布'"
        :icon="iconNote"
      >
        <div class="chart">
          <chart
            :options="operateMileageData"
            :auto-resize="true"
          ></chart>
        </div>
      </NumberBlock>
      <NumberBlock
        class="run-nums-block"
        :theme="2"
        :blockTitle="`车辆月平均油耗分布`"
        :icon="iconOil"
      >
        <div class="chart">
          <chart
            :options="averageFuelData"
            :auto-resize="true"
          ></chart>
        </div>
      </NumberBlock>
    </div>
  </div>
</template>

<script>
import iconKm from '@/assets/kms/all-mileage.png';
import iconHours from '@/assets/kms/all-runtime.png';
import iconFaults from '@/assets/kms/fault-top5.png';
import iconBar from '@/assets/kms/mileage-section.png';
import iconNote from '@/assets/kms/run-mileage.png';
import iconOil from '@/assets/kms/oil-section.png';
import Pie from '@/components/larger/echarts/pie';
import { graphic } from 'echarts/lib/export';
import getKmsPage2Service from '@/services/getKmsPage2';
import { setInterval, clearInterval, setTimeout } from 'timers';

export default {
  name: 'kms-page2',
  data () {
    return {
      iconKm,
      iconHours,
      iconFaults,
      iconBar,
      iconNote,
      iconOil,
      leftMilege: 0,
      leftRunTime: 0,
      faultTop5Data: {},
      // main
      map0: {},
      map1: {},
      map2: {},
      map3: {},
      map4: {},
      map5: {},
      map6: {},
      totals: [],
      hours: [],
      singleLeft: 0, // 时间标签的间距
      lineBWidth: 0,
      activeMapIndex: 0,
      timer: null,
      durTime: '.5s',
      allDataReady: false,
      // right
      mileageSectionData: {},
      operateMileageData: {},
      averageFuelData: {}
    };
  },
  components: {
    Pie
  },
  methods: {
    getData () {
      this.getMileageTime();
      this.getFaultTop5();
      this.getMileageSection();
      this.getChartRunAndOil();
      this.beforeGetMapData();
    },
    async getMileageTime () {
      let _self = this;
      let obj = await getKmsPage2Service.getMileageTime();
      obj.subscribe(res => {
        if (res.data.type === 'success') {
          let mileage = res.data.data.mileage;
          let times = res.data.data.run_Time;
          _self.leftMilege = Number(mileage);
          _self.leftRunTime = Number(times);
        }
      }, err => console.warn(err));
    },
    async getFaultTop5 () {
      let _self = this;
      let obj = await getKmsPage2Service.getFaultTop20ByMonth();
      obj.subscribe(res => {
        if (res.data.type === 'success') {
          var names = [
            {
              oName: '后处理出口氮氧化物–数据有效但高于正常工作范围–最高严重级别',
              nName: '后处理出口氮氧化物超标'
            },
            {
              oName: '车速信号故障',
              nName: '车速信号故障'
            },
            {
              oName: '发动机冷却液位1传感器电路–电压高于正常值，或对高压电源短路',
              nName: '发动机冷却液位电压异常'
            },
            {
              oName: '油中含水故障',
              nName: '油中含水故障'
            },
            {
              oName: '燃油控制阀（IMV）损坏',
              nName: '燃油控制阀损坏'
            },
            {
              oName: '发动机冷却液位1传感器电路–电压低于正常值，或对低压电源短路',
              nName: '发动机冷却液位电压低'
            },
            {
              oName: '环境空气温度故障',
              nName: '环境空气温度故障'
            },
            {
              oName: '催化剂罐液位–数据有效但低于正常工作范围–最高严重级别',
              nName: '催化剂罐液位抵'
            },
            {
              oName: '线路故障或接头进水',
              nName: '线路故障或接头进水'
            }, {
              oName: 'EBP开关电压高或短路',
              nName: 'EBP开关电压高或短路'
            },
            {
              oName: '发动机系统故障',
              nName: '发动机系统故障'
            },
            {
              oName: '氮氧排放故障',
              nName: '氮氧排放故障'
            },
            {
              oName: '发动机或者系统故障',
              nName: '发动机或者系统故障'
            },
            {
              oName: 'SCR催化器上游温度故障',
              nName: '催化器上游温度故障'
            },
            {
              oName: '发动机机油故障',
              nName: '发动机机油故障'
            },
            {
              oName: '冷却液液位数据低',
              nName: '冷却液液位数据低'
            }
          ];

          let d = res.data.data;
          let seriesData = [];
          let namesArr = [];
          names.forEach((v, i) => {
            d.forEach(x => {
              if (v.oName === x.name && !namesArr.includes(v.oName)) {
                seriesData.push({
                  name: v.nName,
                  value: x.count
                });
                namesArr.push(v.oName);
              }
            });
          });
          let arr = seriesData.sort((a, b) => b.count - a.count).slice(0, 5);
          let _data = {
            legendIcon: 'rect',
            legendAlign: 'left',
            legendTop: '65%',
            legendRight: 'center',
            legendTextColor: '#fff',
            legendTextFormatter: 'normal',
            width: '100%',
            center: ['50%', '35%'],
            radius: '45%',
            colors: ['#3f536b', '#f15c13', '#ffb30f', '#28a5df', '#7e5ee5', '#fe912a', '#fec959', '#95bc11'],
            data: arr
          };
          _self.faultTop5Data = _data;
        }
      });
    },
    async getMileageSection () {
      let _self = this;
      let obj = await getKmsPage2Service.getMileageSection();
      obj.subscribe(res => {
        if (res.data.type === 'success') {
          let data = res.data.data;
          let xData = [];
          let yData = [];
          let sumOfGt25 = 0;
          data.forEach((v, i) => {
            if (i > 4) {
              sumOfGt25 += v.num;
            } else {
              xData.push(v.section);
              yData.push(v.num);
            }
          });
          xData.push('>25');
          yData.push(sumOfGt25);
          _self.mileageSectionData = {
            animation: false,
            tooltip: {
              trigger: 'axis',
              formatter: function (params) {
                var str = '';
                str = params[0].name;
                str += '万公里<br/>';
                str += '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + '#eb8812' + ';"></span>' + params[0].seriesName + ':' + params[0].data;
                return str;
              }
            },
            grid: {
              left: '15%',
              right: '20%'
            },
            xAxis: [{
              name: '万公里',
              nameTextStyle: {
                color: 'rgba(255, 255, 255, .3)'
              },
              type: 'category',
              data: xData,
              axisLabel: {
                interval: 0,
                fontSize: 12,
                color: 'rgba(255, 255, 255, .6)'
              },
              axisLine: {
                lineStyle: {
                  color: '#131457'
                }
              },
              axisTick: {
                interval: 0
              }
            }],
            yAxis: [{
              name: '车辆数（辆）',
              type: 'value',
              nameTextStyle: {
                color: 'rgba(255, 255, 255, .3)'
              },
              axisLabel: {
                textStyle: {
                  fontSize: 8,
                  color: 'rgba(255, 255, 255, .6)'
                }
              },
              splitLine: {
                lineStyle: {
                  color: ['#1a2567']
                }
              },
              axisLine: {
                lineStyle: {
                  color: ['#1a2567']
                }
              }
            }],
            series: [{
              name: '车辆数',
              type: 'bar',
              barWidth: 20,
              itemStyle: {
                normal: {
                  color: new graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: '#eb8812'
                  }, {
                    offset: 1,
                    color: 'rgba(235, 136, 18, 0)'
                  }])
                }
              },
              data: yData
            }]
          };
        }
      }, err => console.warn(err));
    },
    async getChartRunAndOil () {
      let _self = this;
      let obj = await getKmsPage2Service.getChartRunAndOil();
      obj.subscribe(res => {
        if (res.data.type === 'success') {
          let d = res.data.data;
          if (d.length === 13) d.pop();
          let xData = [];
          let series1 = []; // 月里程分布
          let series2 = []; // 月运营率
          let series3 = []; // 月平均油耗
          d.forEach(v => {
            let month = v.data_month.split('-')[1];
            xData.push(parseInt(month));
            series1.push(Math.round(v.avg_mileage / 1000));
            series2.push(v.attendance_Rate);
            series3.push(Math.round(v.avg_per_fuel_consumption_filter * 100) / 100);
          });
          _self.operateMileageData = {
            animation: false,
            legend: {
              show: true,
              data: ['里程', '运营率'],
              left: 'center',
              top: '8%',
              textStyle: {
                color: 'rgba(255, 255, 255, .6)'
              }
            },
            tooltip: {
              trigger: 'axis',
              formatter: function (params) {
                var str = '';
                str += params[0].name + '月';
                str += '<br/>';
                str += '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + '#1e72bb' + ';"></span>' + params[0].seriesName + ':' + params[0].data;
                str += '<br/>';
                str += '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + '#eb8812' + '"></span>' + params[1].seriesName + ':' + params[1].data;
                return str;
              }
            },
            grid: {
              left: '13%',
              right: '19%',
              top: '30%'
            },
            xAxis: [{
              type: 'category',
              data: xData,
              axisLabel: {

                fontSize: 12,
                color: 'rgba(255, 255, 255, .6)',

                interval: 0,
                formatter: function (v, index) {
                  if (index !== 0 && v === 1) {
                    return v + '\n' + '{year|' + new Date().getFullYear() + '年}';
                  } else {
                    return v;
                  }
                },
                rich: {
                  year: {
                    color: 'rgba(255, 255, 255, 0.3)',
                    lineHeight: 20
                  }
                }
              },
              axisLine: {
                lineStyle: {
                  color: '#131457'
                }
              },
              axisTick: {
                interval: 0
              }
            }],
            yAxis: [
              {
                name: '里程（KM）',
                type: 'value',
                nameTextStyle: {
                  color: 'rgba(255, 255, 255, .3)'
                },
                axisLabel: {
                  textStyle: {
                    fontSize: 8,
                    color: 'rgba(255, 255, 255, .6)'
                  }
                },
                splitLine: {
                  lineStyle: {
                    color: ['#1a2567']
                  }
                },
                axisLine: {
                  lineStyle: {
                    color: ['#1a2567']
                  }
                }
              },
              {
                name: '运营率（%）',
                type: 'value',
                min: 0,
                max: 100,
                interval: 20,
                nameTextStyle: {
                  color: 'rgba(255, 255, 255, .3)'
                },
                axisLabel: {
                  textStyle: {
                    fontSize: 8,
                    color: 'rgba(255, 255, 255, .6)'
                  }
                },
                splitLine: {
                  lineStyle: {
                    color: ['#1a2567']
                  }
                },
                axisLine: {
                  lineStyle: {
                    color: ['#1a2567']
                  }
                }
              }
            ],
            series: [
              {
                name: '里程',
                type: 'bar',
                barWidth: 15,
                itemStyle: {
                  normal: {
                    color: new graphic.LinearGradient(0, 0, 0, 1, [{
                      offset: 0,
                      color: '#1e72bb'
                    }, {
                      offset: 1,
                      color: 'rgba(30, 114, 187, 0)'
                    }])
                  }
                },
                data: series1
              },
              {
                name: '运营率',
                type: 'line',
                yAxisIndex: 1,
                itemStyle: {
                  normal: {
                    color: '#eb8812'
                  }
                },
                data: series2
              }
            ]
          };
          _self.averageFuelData = {
            animation: false,
            tooltip: {
              trigger: 'axis',
              formatter: function (params) {
                var str = '';
                str = params[0].name + '月';
                str += '<br/>';
                str += '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + '#eb8812' + ';"></span>' + params[0].seriesName + ':' + params[0].data;
                return str;
              }
            },
            grid: {
              left: '17%',
              right: '15%',
              top: '25%'
            },
            xAxis: [{
              type: 'category',
              data: xData,
              axisLabel: {

                fontSize: 12,
                color: 'rgba(255, 255, 255, .6)',
                interval: 0,
                formatter: function (v, index) {
                  if (index !== 0 && v === 1) {
                    return v + '\n' + '{year|' + new Date().getFullYear() + '年}';
                  } else {
                    return v;
                  }
                },
                rich: {
                  year: {
                    color: 'rgba(255, 255, 255, 0.3)',
                    lineHeight: 20
                  }
                }

              },
              axisLine: {
                lineStyle: {
                  color: '#131457'
                }
              },
              axisTick: {
                interval: 0
              }
            }],
            yAxis: [{
              type: 'value',
              name: '油耗(L/100KM)',
              nameTextStyle: {
                color: 'rgba(255, 255, 255, .3)',
                align: 'center'
              },
              axisLabel: {
                textStyle: {
                  fontSize: 8,
                  color: 'rgba(255, 255, 255, .6)'
                }
              },
              splitLine: {
                lineStyle: {
                  color: ['#1a2567']
                }
              },
              axisLine: {
                lineStyle: {
                  color: ['#1a2567']
                }
              }
            }],
            series: [{
              name: '百公里油耗',
              type: 'bar',
              barWidth: 15,
              itemStyle: {
                normal: {
                  color: new graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: '#eb8812'
                  }, {
                    offset: 1,
                    color: 'rgba(235, 136, 18, 0)'
                  }])
                }
              },
              data: series3
            }]
          };
        }
      }, err => console.warn(err));
    },
    beforeGetMapData () {
      let fourHours = 1000 * 60 * 60 * 4;
      let hours = [];
      for (let i = 0; i < 7; i++) {
        let now = new Date(Date.now() - fourHours * i);
        let nowHour = now.getHours();
        let a = parseInt(nowHour / 4) * 4;
        hours[i] = (a < 10 ? '0' + a : a) + ':00';
        let stamp = Date.parse(now.toLocaleDateString() + ` ${a}:00:00`);
        this.requestMapData(stamp, i);
      }

      let w = this.$refs.lineBox.clientWidth;
      this.singleLeft = w / 6;
      this.hours = hours.reverse();
    },
    async requestMapData (timeStamp, n) {
      let _self = this;
      let obj = await getKmsPage2Service.getMapData({ timeMillis: timeStamp });
      obj.subscribe(res => {
        if (res.data.type === 'success') {
          let d = res.data.data;
          _self.$set(this.totals, n, d.total);
          this.renderMap(d, n);
          let flag = this.totals.every(v => isNaN(v) === false);
          if (this.totals.length === 7 && flag) {
            this.allDataReady = true;
            this.loopMap();
          }
        }
      }, err => console.warn(err));
    },
    renderMap (data, n) {
      let option = {
        animation: false,
        color: ['#c8ca12', '#f4ffcb', '#fff'],
        legend: {
          show: false,
          data: ['弱', '中', '强'],
          top: '5%',
          left: '5%',
          bottom: '5%',
          right: '5%',
          textStyle: {
            color: 'rgba(255, 255, 255, 0.8)'
          }
        },
        geo: {
          map: 'china',
          label: {
            normal: {
              show: false,
              textStyle: {
                color: '#4ec2db',
                fontSize: 12
              },
              z: 2
            },
            emphasis: {
              show: false,
              textStyle: {
                color: '#4ec2db',
                fontSize: 12
              }
            }
          },
          itemStyle: {
            normal: {
              areaColor: 'rgba(0, 0, 0, .08)',
              borderColor: 'rgb(65, 119, 177)',
              borderWidth: 1
            },
            emphasis: {
              areaColor: 'rgba(0, 0, 0, .08)',
              label: {
                show: false
              }
            }
          }
        },
        series: [
          {
            name: '弱',
            type: 'scatter',
            coordinateSystem: 'geo',
            symbolSize: 2,
            large: true,
            largeThreshold: 1000,
            progressive: 100,
            itemStyle: {
              shadowBlur: 0,
              opacity: 1,
              shadowColor: 'blue'
            },
            data: []
          },
          {
            name: '中',
            type: 'scatter',
            coordinateSystem: 'geo',
            symbolSize: 2,
            large: true,
            largeThreshold: 1000,
            progressive: 100,
            itemStyle: {
              shadowBlur: 0,
              opacity: 1,
              shadowColor: 'blue'
            },
            data: []
          },
          {
            name: '强',
            type: 'scatter',
            coordinateSystem: 'geo',
            symbolSize: 2,
            large: true,
            largeThreshold: 1000,
            progressive: 100,
            itemStyle: {
              shadowBlur: 0,
              opacity: 1,
              shadowColor: 'blue'
            },
            data: []
          }
        ]
      };
      option.series[0].data = data.low;
      option.series[1].data = data.middle;
      option.series[2].data = data.high;
      setTimeout(() => {
        this['map' + n] = option;
      }, 1000);
    },
    changeMap (n) {
      clearInterval(this.timer);
      let lineB = this.$refs.lineB;
      lineB.style.transitionDuration = '0s';
      lineB.style.width = n * this.singleLeft + 'px';
      // console.log(window.document.body.clientHeight);
      lineB.style.transitionDuration = '5s';
      this.activeMapIndex = n;
      this.loopMap();
    },
    loopMap () {
      let lineB = this.$refs.lineB;
      this.timer = setInterval(() => {
        lineB.style.transitionDuration = '5s';
        this.activeMapIndex++;
        if (this.activeMapIndex > 6) {
          lineB.style.transitionDuration = '0s';
          lineB.style.width = '0';
          // console.log(window.document.body.clientWidth);
          lineB.style.transitionDuration = '5s';
          this.activeMapIndex = 0;
        }
      }, 5000);
    }
  },
  mounted () {
    this.getData();
  },
  computed: {
    totalsReverse () {
      let arr = this.totals;
      let flag = arr.every(v => isNaN(v) === false);
      if (arr.length === 7 && flag) {
        return arr.reverse();
      }
      return arr;
    }
  },
  destroyed () {
    this.timer = null;
  }
};
</script>

<style lang="scss" scoped>
.box {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: calc(100% - 92px);
  overflow: hidden;
  .left,
  .right {
    padding-top: 20px;
    width: 370px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    & > div {
      margin-top: 0.5rem;
      flex: 1;
    }
  }
  .main {
    flex: 1;
    .map-box {
      width: 100%;
      height: 80%;
      position: relative;
      .map {
        width: 100%;
        height: 100%;
        position: absolute;
        opacity: 0;
        top: 0;
        left: 0;
        &.show {
          opacity: 1;
        }
      }
    }
    .timeline {
      width: 80%;
      margin: 0 auto;
      position: relative;
      z-index: 9999;
      h3 {
        opacity: 1;
        display: inline;
        font-family: "LGDR";
        margin-left: -45px;
        position: relative;
        left: 0;
        text-align: left;
        font-size: 30px;
        line-height: 50px;
        color: #ffbc1c;
        transition: left 0.5s linear;
        &.opa {
          opacity: 1;
        }
      }
      .linebox {
        .line-a {
          height: 1px;
          background-color: rgba(255, 255, 255, 0.4);
          position: relative;
          span {
            position: absolute;
            // display: block;
            width: 2px;
            height: 5px;
            background-color: #ffbc1c;
            top: -2px;
          }
        }
        .line-b {
          max-width: 100%;
          position: relative;
          left: 1px;
          height: 1px;
          background-color: #ffbc1c;
          width: 0;
          margin-top: -1px;
          transition: width 5s linear;
          transition-duration: 0.5s;
        }
        .timebox {
          position: relative;
          span {
            position: absolute;
            top: 5px;
            margin-left: -20px;
            padding: 2px 3px;
            text-align: center;
            font-size: 16px;
            color: rgba(255, 255, 255, 0.8);
            cursor: pointer;
          }
        }
      }
      .tip {
        color: rgba(255, 255, 255, 0.3);
        font-size: 12px;
        margin-left: -21px;
        margin-top: 35px;
        letter-spacing: 1px;
      }
    }
  }
  .left {
    margin-left: 2%;
    .fault-top5 {
      h2 {
        color: #fff;
        padding: 0 0 0.05rem 0.37rem;
        i {
          display: inline-block;
          width: 0.26rem;
          height: 0.26rem;
          margin: 0.02rem 0.06rem 0 0;
          background-size: 100% 100%;
          vertical-align: bottom;
        }
        span {
          font-size: 0.18rem;
        }
      }
      .fault-chart {
        height: 3.5rem;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center center;
      }
    }
    /deep/ .run-num {
      padding-top: .39rem;
    }
  }
  .right {
    margin-right: 2%;
    .chart {
      height: 2.2rem;
      >>> .echarts {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
