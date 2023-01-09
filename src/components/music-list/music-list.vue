<!--歌手详情页组件-->
<template>
  <div class="music-list">
    <div
      class="back"
      @click="goBack"
    >
      <i class="icon-back"></i>
    </div>
    <!--标题：歌手名-->
    <h1 class="title">{{ title }}</h1>
    <!--背景图-->
    <div
      class="bg-image"
      :style="bgImageStyle"
      ref="bgImage"
    >
      <div
        class="filter"
        :style="filterStyle"
      ></div>
    </div>
    <scroll
      class="list"
      :style="scrollStyle"
      v-loading="loading"
      :probe-type="3"
      @scroll="onScroll"
    >
    <!--probe-type="3" 派发实时滚动位置-->
      <div class="song-list-wrapper">
        <song-list
          :songs="songs"
        ></song-list>
      </div>
    </scroll>
  </div>
</template>

<script>
import SongList from '@/components/base/song-list/song-list'
import Scroll from '@/components/base/scroll/scroll'

const RESERVED_HEIGHT = 40 // 标题栏的高度

export default {
  name: 'music-list',
  components: {
    SongList,
    Scroll
  },
  // 引用父元素的数据
  props: {
    // 歌曲数组
    songs: {
      type: Array,
      default() {
        return []
      }
    },
    // 标题
    title: String,
    // 背景图片
    pic: String,
    loading: Boolean
  },
  data() {
    return {
      // 背景图的高度
      imageHeight: 0,
      // 滚动的距离
      scrollY: 0,
      // 可滚动的最大值
      maxTranslateY: 0
    }
  },
  computed: {
    // 给背景图动态添加css属性
    bgImageStyle() {
      const scrollY = this.scrollY
      // 默认的图层级别z-index
      let zIndex = 0
      // 设置背景图比例// 10:7
      let paddingTop = '70%'
      let height = 0
      // 沿着z轴在三维空间中重新定位元素
      let translateZ = 0

      // 当前位置超过了可滚动的最大值就修改样式
      if (scrollY > this.maxTranslateY) {
        zIndex = 10
        paddingTop = 0
        // 限制到顶部的距离
        height = `${RESERVED_HEIGHT}px`
        translateZ = 1
      }

      // scale 缩放比例
      let scale = 1
      // 下拉时scrollY就会小于0
      if (scrollY < 0) {
        scale = 1 + Math.abs(scrollY / this.imageHeight)
      }

      return {
        zIndex,
        paddingTop,
        height,
        backgroundImage: `url(${this.pic})`,
        transform: `scale(${scale})translateZ(${translateZ}px)`
      }
    },
    // 给歌曲列表动态添加top属性
    scrollStyle() {
      return {
        top: `${this.imageHeight}px`
      }
    },
    // 向上滑动时给背景图添加模糊效果
    filterStyle() {
      // blur模糊程度
      let blur = 0
      const scrollY = this.scrollY
      const imageHeight = this.imageHeight
      // 向上滑动时
      if (scrollY >= 0) {
        // 设置模糊程度的范围 Math.min:设置一个最大值
        blur = Math.min(this.maxTranslateY / imageHeight, scrollY / imageHeight) * 20
      }
      return {
        // 模糊效果
        backdropFilter: `blur(${blur}px)`
      }
    }
  },
  mounted () {
    // 获取背景图的高度
    this.imageHeight = this.$refs.bgImage.clientHeight
    this.maxTranslateY = this.imageHeight - RESERVED_HEIGHT
  },
  methods: {
    // 返回上一页
    goBack() {
      this.$router.back()
    },
    // 获取当前滚动到的位置
    onScroll(pos) {
      this.scrollY = -pos.y
    }
  }
}
</script>

<style lang="scss" scoped>
.music-list {
  position: relative;
  height: 100%;
  .back {
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 20;
    transform: translateZ(2px);
    .icon-back {
      display: block;
      padding: 10px;
      font-size: $font-size-large-x;
      color: $color-theme;
    }
  }
  .title {
    position: absolute;
    top: 0;
    left: 10%;
    width: 80%;
    z-index: 20;
    transform: translateZ(2px);
    @include no-wrap();
    text-align: center;
    line-height: 40px;
    font-size: $font-size-large;
    color: $color-text;
  }
  .bg-image {
    position: relative;
    width: 100%;
    transform-origin: top;
    // 指定背景图像的大小
    background-size: cover;// cover此时会保持图像的纵横比并将图像缩放成将完全覆盖背景定位区域的最小大小
    .play-btn-wrapper {
      position: absolute;
      bottom: 20px;
      z-index: 10;
      width: 100%;
      .play-btn {
        box-sizing: border-box;
        width: 135px;
        padding: 7px 0;
        margin: 0 auto;
        text-align: center;
        border: 1px solid $color-theme;
        color: $color-theme;
        border-radius: 100px;
        font-size: 0;
      }
      .icon-play {
        display: inline-block;
        vertical-align: middle;
        margin-right: 6px;
        font-size: $font-size-medium-x;
      }
      .text {
        display: inline-block;
        vertical-align: middle;
        font-size: $font-size-small;
      }
    }
    .filter {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(7, 17, 27, 0.4);
    }
  }
  .list {
    position: absolute;
    bottom: 0;
    width: 100%;
    z-index: 0;
    .song-list-wrapper {
      padding: 20px 30px;
      background: $color-background;
    }
  }
}
</style>
