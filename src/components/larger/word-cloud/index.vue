<template>
  <div class="word-cloud" ref="wordCloud"></div>
</template>

<script>
window.THREE = require('./js/three.js');
require('./js/projector.js');
require('./js/canvas-renderer.js');
require('./js/stats.min.js');
let Colors = ['rgb(255,84,84)', '#ffcd54', '#52a7ff', 'rgb(255,205,84)', 'rgb(255,255,255)'];
export default {
  name: 'index',
  data () {
    return {
      wordW: 320,
      wordH: 200,
      group: null,
      renderer: null,
      scene: null,
      camera: null,
      id: null,
      particle: null,
      animateId: null,
      sprites: []
    };
  },
  props: {
    bgColor: {
      type: String,
      default: '#2a3561'
    },
    words: {
      type: Array,
      default: () => {
        return [
          {
            name: '',
            value: 0
          }
        ];
      }
    }
  },
  watch: {
    words () {
      // 停止动画
      if (this.animateId !== null) {
        cancelAnimationFrame(this.animateId);
        this.animateId = null;
      }
      // 传入数据变化，重新创建精灵图
      this.creatThree();
      this.animateThree();
    }
  },
  mounted: function () {
    this.creatThree();
    this.animateThree();
  },
  methods: {
    renderCloud () {
      this.group.rotation.x += 0.03;
      this.renderer.render(this.scene, this.camera);
    },
    animateThree () {
      this.animateId = requestAnimationFrame(this.animateThree);
      this.renderCloud();
    },
    creatThree () {
      /* eslint-disable */
      let $wordCloud = this.$refs.wordCloud;
      if (!$wordCloud) return;
      let w = this.wordW;
      let h = this.wordH;
      // let THREE = window.THREE;
      // 创建场景、相机、渲染器
      this.camera = new THREE.PerspectiveCamera(80, w / h, 1, 3000);
      this.scene = new THREE.Scene();
      this.group = new THREE.Group();
      this.renderer = new THREE.CanvasRenderer({
        autoClear: true
      });
      this.renderer.setPixelRatio(window.devicePixelRatio);
      // 设置场景宽高
      this.renderer.setSize(w, h);
      $wordCloud.innerHTML = '';
      $wordCloud.appendChild(this.renderer.domElement);
      this.camera.position.z = 1000;
      this.scene.background = new THREE.Color(this.bgColor);
      this.scene.add(this.group);
      // this.renderer.setClearColor(0xEEEEEE, 0.0); // 场景背景透明
      this.getGroup(this.words);
      // 动态更改宽高
      // this.resize();
    },
    getGroup (words) {
      // 清空精灵图
      this.scene.remove();
      this.sprites = [];
      let count = [];
      let $wordCloud = this.$refs.wordCloud;
      if (!$wordCloud) return;
      let w = this.wordW;
      let h = this.wordH;
      words.forEach(ele => {
        count.push(ele.value);
      });
      let minCount = Math.min(...count);
      let maxCount = Math.max(...count);
      let maxOpacity = 1;
      let minOpercity = 0.3;
      let minFontSize = 12;
      let maxFontSize = 24;
      // 创建文字精灵
      this.sprites = words.map((ele, i) => {
        let opacity = minOpercity + (ele.value - minCount) / (maxCount - minCount) * (maxOpacity - minOpercity);
        let fontSize = minFontSize + (ele.value - minCount) / (maxCount - minCount) * (maxFontSize - minFontSize);
        let color = Colors[Math.floor(Math.random() * Colors.length)];
        let particle = this.creatText({
          text: ele.name,
          font: `Bold ${fontSize}px Arial, 微软雅黑`,
          fontSize,
          color,
          width: w,
          height: h,
          opacity
        });
        particle.position.x = Math.random() * 6 - 3;
        particle.position.y = Math.random() * 2 - 1;
        particle.position.z = Math.random() * 2 - 1;
        particle.position.normalize();
        particle.position.multiplyScalar(Math.random() * 10 + 650);
        particle.scale.multiplyScalar(10);
        // this.group.add(particle);
        return particle;
      });
      // 添加精灵图到组group
      this.sprites.forEach(ele => this.group.add(ele));
      // this.group.add(this.sprites);
      // 将组添加到场景
    },
    creatText (obj) {
      return new THREE.Sprite(new THREE.SpriteCanvasMaterial({
        color: obj.color,
        program: (function (_c) {
          return function (context) {
            context.font = _c.fontSize + 'px';
            context.scale(1, -1);
            context.fillText(_c.text, _c.text.length * _c.fontSize / -2, 0);
          };
        })(obj)
      }));
    },
    createTextTexture (obj) {
      // 创建文字canvas图片
      let canvas = document.createElement('canvas');
      canvas.width = obj.width || 300;
      canvas.height = obj.height || 120;
      let ctx = canvas.getContext('2d');
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.font = obj.font || 'Bold 10px Arial, 微软雅黑';
      ctx.fillStyle = obj.color || '#f00';
      ctx.fillText(obj.text, obj.width / 3, obj.height / 2);
      let texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      return texture;
    },
    resize () {
      this.onWindowResize();
      let timer = setTimeout(() => {
        clearTimeout(timer);
        timer = null;
        window.addEventListener('resize', this.onWindowResize, false);
      }, 100);
    },
    onWindowResize () {
      let $wordCloud = this.$refs.wordCloud;
      let w = $wordCloud.getBoundingClientRect().width;
      let h = $wordCloud.getBoundingClientRect().height;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    }
  }
};
</script>

<style scoped lang="scss">
  .word-cloud {
    width: 320px;
    height: 200px;
  }
</style>
