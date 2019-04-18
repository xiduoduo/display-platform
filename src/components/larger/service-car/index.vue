<template>
  <div class="contents clearfix section-block">
    <div class="list" v-if="getData && getData.name">
      <div class="car-info">
        <div class="base-box">
          <div class="base default animated" :class="[getData.name ? 'fadeInDown' : '', lever ? 'fadeOutDown' : '']">
            <img :src="getData.imgUrl" alt="">
            <div>
              <p class="brand">{{getData.name}}</p>
              <p class="lpn" v-if="getData.lpn">{{getData.lpn}}</p>
            </div>
          </div>
        </div>
        <div class="detail default animated" :class="[getData.name ? 'fadeIn' : '', lever ? 'fadeOut' : '']">
          <div class="speed">
            <i class="svg-font service-speed"></i>
            <label>当前车速：</label>
            <span>{{getData.speed}}KM/H</span>
          </div>
          <div class="mileage">
            <i class="svg-font service-mileage"></i>
            <label>累积行驶里程：</label>
            <span>{{getData.mileage}}KM</span>
          </div>
          <div class="hour">
            <i class="svg-font service-time"></i>
            <label>累积行驶时长：</label>
            <span>{{getData.time}}H</span>
          </div>
          <div class="position">
            <i class="svg-font service-position"></i>
            <label>当前位置：</label>
            <span>{{getData.position}}</span>
          </div>
          <div class="grade">
            <i class="svg-font service-grade"></i>
            <label>驾驶评分：</label>
            <span>{{getData.grade}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'index',
  props: {
    setData: {
      type: Object,
      default: () => {
        return {
          name: '',
          imgUrl: '',
          lpn: '',
          speed: 0,
          mileage: 0,
          time: 0,
          position: '',
          grade: 0
        };
      }
    },
    lever: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    getData () {
      return this.setData;
    }
  }
};
</script>

<style scoped lang="scss">
  .contents {

    div.list {
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
    p.lpn {
      color: #5b8fed;
      border: solid 2px rgba(91, 143, 237, 0.5);
    }
    div.car-info {
      width: 100%;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      position: relative;
      opacity: 1;

      .base-box {
        width: 100%;
        overflow: hidden;
      }

      div.base {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        position: relative;
        top: 0;
        z-index: 1;
        padding-bottom: 10px;
        overflow: hidden;

        img {
          width: 82px;
          height: 57px;
          margin: 0 32px 0 26px;
          /*display: none;*/
        }

        div {
          flex: 1;
          overflow: hidden;

          p {
            line-height: 1;
          }

          p.brand {
            color: #fff;
            font-size: 18px;
            margin-bottom: 10px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          p.lpn {
            border-radius: 2px;
            font-size: 12px;
            display: inline-block;
            padding: 3px 4px;
            line-height: 1;

            &.hide {
              display: none;
            }
          }
        }
      }

      .default {
        /*display: none !important;*/
      }

      div.detail {
        flex: 1;
        width: 100%;
        border-top: 1px solid rgba(255, 255, 255, 0.15);
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: space-between;
        padding-top: 4px;
        /*position: absolute;*/
        /*top: 57px;*/
        /*z-index: 2;*/

        div {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: flex-start;
          font-size: 12px;
          margin-top: 5px;

          i {
            display: block;
            margin-left: 11px;
            font-size: 12px;
            width: 15px;
            text-align: center;
          }

          label {
            font-size: 12px;
            color: rgba(255, 255, 255, 0.6);
            margin: 0 0 0 11px;
            width: 100px;

          }

          span {
            flex: 1;
            display: inline-block;
            width: 150px;
            color: white;
            font-size: 12px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          &.speed {
            i {
            }
          }

          &.mileage {
            i {
            }
          }

          &.hour {
            i {
            }
          }

          &.position {
            i {
            }
          }

          &.grade {
            i {
            }
          }
        }
      }

      .base.new {
        height: 0;
        opacity: 0;
      }

      /* &.active {
        .base {
          height: 57px;
          opacity: 1;
          transition: height .9s, opacity .5s .6s;
        }

      } */

      .base.new.active {
        opacity: 1;
        height: 57px;
        margin-bottom: 20px;
        transition: height 1s, opacity 1s .3s, margin 1s;
      }

    }
  }
</style>
