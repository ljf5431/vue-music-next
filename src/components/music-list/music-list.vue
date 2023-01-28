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
        class="play-btn-wrapper"
        :style="playBtnStyle"
      >
        <div
          v-show="songs.length > 0"
          class="play-btn"
          @click="random"
        >
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div
        class="filter"
        :style="filterStyle"
      ></div>
    </div>
    <scroll
      class="list"
      :style="scrollStyle"
      v-loading="loading"
      v-no-result:[noResultText]="noResult"
      :probe-type="3"
      @scroll="onScroll"
    >
    <!--probe-type="3" 派发实时滚动位置-->
      <div class="song-list-wrapper">
        <song-list
          :songs="songs"
          @select="selectItem"
          :rank="rank"
        ></song-list>
      </div>
    </scroll>
  </div>
</template>

<script>
import SongList from '@/components/base/song-list/song-list'
import Scroll from '@/components/wrap-scroll'
import { mapActions, mapState } from 'vuex'

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
    // loading组件的判断结果
    loading: Boolean,
    // 修改no-result组件的标题
    noResultText: {
      type: String,
      default: '抱歉，没有找到可播放的歌曲'
    },
    rank: Boolean
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
    // loading组件过后且songs数组为空时，展示无数据组件
    noResult() {
      return !this.loading && !this.songs.length
    },
    // 随机播放按钮
    playBtnStyle() {
      // 默认情况下display为空不修改原来的布局
      let display = ''
      // 当前滚动位置超过了可滚动的最大值就修改display的布局
      if (this.scrollY >= this.maxTranslateY) {
        display = 'none'
      }
      return {
        display
      }
    },
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
      const bottom = this.playlist.length ? '60px' : '0'
      return {
        top: `${this.imageHeight}px`,
        bottom
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
    },
    // 获取正在播放的歌曲播放列表
    ...mapState([
      'playlist'
    ])
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
    },
    // 提交点击的的歌曲(顺序播放)
    selectItem({ song, index }) {
      this.selectPlay({
        // 当前所在的歌曲顺序列表
        list: this.songs,
        // 歌曲的索引
        index
      })
    },
    // 随机播放全部列表
    random() {
      // 传入歌曲顺序列表
      this.randomPlay(this.songs)
    },
    ...mapActions([
      'selectPlay',
      'randomPlay'
    ])
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
