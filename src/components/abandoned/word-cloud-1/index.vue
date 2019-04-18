<template>
  <div class="word-cloud" ref="wordCloud"></div>
</template>

<script>
import * as THREE from 'three';

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
      // 传入数据变化，重新创建精灵图
      this.getGroup(this.words);
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
      let $wordCloud = this.$refs.wordCloud;
      if (!$wordCloud) return;
      // let w = $wordCloud.getBoundingClientRect().width;
      // let h = $wordCloud.getBoundingClientRect().height;
      let w = this.wordW;
      let h = this.wordH;
      // 创建场景、相机、渲染器
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(80, w / h, 1, 3000);
      this.group = new THREE.Group();
      this.renderer = new THREE.WebGLRenderer({
        precision: 'highp',
        autoClear: true,
        antialias: true,
        alpha: true // 场景背景透明
      });
      this.renderer.setClearColor(0xEEEEEE, 0.0); // 场景背景透明
      this.renderer.setPixelRatio(window.devicePixelRatio);
      // 设置场景宽高
      this.renderer.setSize(w, h);
      $wordCloud.appendChild(this.renderer.domElement);
      this.camera.position.z = 1000;
      this.getGroup(this.words);
      // 动态更改宽高
      // this.resize();
    },
    getGroup (words) {
      // 清空精灵图
      this.sprites = [];
      let count = [];
      // console.log(words);
      let $wordCloud = this.$refs.wordCloud;
      if (!$wordCloud) return;
      // let w = $wordCloud.getBoundingClientRect().width;
      // let h = $wordCloud.getBoundingClientRect().height;
      let w = this.wordW;
      let h = this.wordH;
      words.forEach(ele => {
        count.push(ele.value);
      });
      let minCount = Math.min(...count);
      let maxCount = Math.max(...count);
      let maxOpacity = 1;
      let minOpercity = 0.3;
      let minFontSize = 16;
      let maxFontSize = 26;
      // 创建文字精灵
      this.sprites = words.map((ele, i) => {
        let opacity = minOpercity + (ele.count - minCount) / (maxCount - minCount) * (maxOpacity - minOpercity);
        let fontSize = minFontSize + (ele.count - minCount) / (maxCount - minCount) * (maxFontSize - minFontSize);
        let color = Colors[Math.floor(Math.random() * Colors.length)];
        let loders = this.createTextTexture({
          text: ele.name,
          font: `Bold ${fontSize}px Arial, 微软雅黑`,
          fontSize,
          color,
          width: w,
          height: h,
          opacity
        });
        let material = new THREE.SpriteMaterial({
          map: loders,
          opacity: 1
        });
        let particle = new THREE.Sprite(material);
        let x = Math.random() * 6 - 4;
        let y = Math.random() * 3 - 1;
        let z = Math.random() * 2 - 1;
        particle.position.set(x, y, z);
        particle.position.normalize();
        particle.position.multiplyScalar(Math.random() * 60 + 550);
        particle.scale.multiplyScalar(1500);
        return particle;
      });
      // 添加精灵图到组group
      this.sprites.forEach(ele => this.group.add(ele));
      // this.group.add(this.sprites);
      // 将组添加到场景
      this.scene.add(this.group);
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
      // console.log(texture);
      // texture.generateMipmaps = false;
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
