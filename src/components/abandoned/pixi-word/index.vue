<template>
  <div class="my-words" ref="myWords">
    <span class="item-word" :style="{fontSize: item.fontSize, color: item.color, opacity: item.opacity}" v-for="(item, i) in getWords" :key="i">{{item.name}}</span>
  </div>
</template>

<script>
// import wordMove from '@/lib/word-move';
let Colors = ['rgb(255,84,84)', '#ffcd54', '#52a7ff', 'rgb(255,205,84)', 'rgb(255,255,255)'];
export default {
  name: 'index',
  data () {
    return {
      Colors
    };
  },
  props: {
    words: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    getWords () {
      let words = this.words;
      let count = [];
      words.forEach(ele => {
        count.push(ele.value);
      });
      let minCount = Math.min(...count);
      let maxCount = Math.max(...count);
      let maxOpacity = 1;
      let minOpercity = 0.3;
      let minFontSize = 16;
      let maxFontSize = 24;
      return words.map(ele => {
        let opacity = minOpercity + (ele.count - minCount) / (maxCount - minCount) * (maxOpacity - minOpercity);
        let fontSize = minFontSize + (ele.count - minCount) / (maxCount - minCount) * (maxFontSize - minFontSize);
        let color = Colors[Math.floor(Math.random() * Colors.length)];
        return {
          name: ele.name,
          value: ele.value,
          opacity,
          color,
          fontSize
        };
      });
    }
  },
  methods: {
    moves () {
      // eslint-disable-next-line
      require('@/lib/word-move');
      // eslint-disable-next-line
      tagcloud({
        selector: '.my-words', // 元素选择器
        fontsize: 16, // 基本字体大小, 单位px
        radius: 50, // 滚动半径, 单位px 页面宽度和高度的五分之一
        mspeed: 'slow', // 滚动最大速度, 取值: slow, normal(默认), fast
        ispeed: 'slow', // 滚动初速度, 取值: slow, normal(默认), fast
        direction: 135, // 初始滚动方向, 取值角度(顺时针360): 0对应top, 90对应left, 135对应right-bottom(默认)...
        keep: false // 鼠标移出组件后是否继续随鼠标滚动, 取值: false, true(默认) 对应 减速至初速度滚动, 随鼠标滚动
      });
    }
  },
  mounted: function () {
    this.moves();
  }
};
</script>

<style scoped lang="scss">
  .my-words {
    position: relative;
    width: 98%;
    height: 97%;

    span {
      position: absolute;
      top: 0;
      left: 0;
      color: #fff;
      font-weight: bold;
      text-decoration: none;
      padding: 3px 6px;
    }
  }
</style>
