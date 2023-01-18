<!--全局迷你播放器组件-->

<template>
<!--transition：Vue的内置动画标签-->
  <transition name="mini">
    <div
      class="mini-player"
      v-show="!fullScreen"
      @click="showNormalPlayer"
    >
      <div class="cd-wrapper">
        <!--CD-->
        <div
          class="cd"
          ref="cdRef"
        >
          <img
            width="40"
            height="40"
            :src="currentSong.pic"
            :class="cdCls"
            ref="cdImageRef"
          >
        </div>
      </div>
      <!--歌曲消息-->
      <div
        class="slider-wrapper"
        ref="sliderWrapperRef"
      >
        <div class="slider-group">
          <div
            class="slider-page"
            v-for="song in playlist"
            :key="song.id"
          >
            <h2 class="name">{{song.name}}</h2>
            <p class="desc">{{song.singer}}</p>
          </div>
        </div>
      </div>
      <div class="control">
        <progress-circle
          :radius="32"
          :progress="progress"
        >
          <i
            class="icon-mini"
            :class="miniPlayIcon"
            @click.stop="togglePlay"
          ></i>
        </progress-circle>
      </div>
      <div class="control" @click.stop="showPlaylist">
        <i class="icon-playlist"></i>
      </div>
      <Playlist ref="playlistRef"></Playlist>
    </div>
  </transition>
</template>

<script>
import { useStore } from 'vuex'
import { computed, ref } from 'vue'
import useCd from '@/components/player/use-cd'
import useMiniSlider from '@/components/player/use-mini-slider'
import ProgressCircle from '@/components/player/progress-circle'
import Playlist from '@/components/player/playlist'

export default {
  name: 'mini-player',
  components: {
    ProgressCircle,
    Playlist
  },
  props: {
    // play组件的播放进度
    progress: {
      type: Number,
      default: 0
    },
    // play组件的暂停方法
    togglePlay: Function
  },

  setup() {
    // 获取播放列表的DOM对象
    const playlistRef = ref(null)

    const store = useStore()
    // 播放器的收起或全屏的状态标识
    const fullScreen = computed(() => store.state.fullScreen)
    // 当前播放的歌曲消息
    const currentSong = computed(() => store.getters.currentSong)
    // 播放状态
    const playing = computed(() => store.state.playing)
    // 正在播放的歌曲播放列表
    const playlist = computed(() => store.state.playlist)

    const { cdCls, cdRef, cdImageRef } = useCd()
    const { sliderWrapperRef } = useMiniSlider()

    // 根据播放状态修改按钮图标
    const miniPlayIcon = computed(() => {
      return playing.value ? 'icon-pause-mini' : 'icon-play-mini'
    })

    // 点击全屏打开播放器
    function showNormalPlayer() {
      // 修改setFullScreen的值为true
      store.commit('setFullScreen', true)
    }

    // 点击打开播放列表组件
    function showPlaylist() {
      playlistRef.value.show()
    }

    return {
      fullScreen,
      currentSong,
      playlist,
      miniPlayIcon,
      showNormalPlayer,
      // cd
      cdCls,
      cdRef,
      cdImageRef,
      sliderWrapperRef,

      playlistRef,
      showPlaylist
    }
  }
}
</script>

<style lang="scss" scoped>
.mini-player {
  display: flex;
  align-items: center;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 180;
  width: 100%;
  height: 60px;
  background: $color-highlight-background;
  .cd-wrapper {
    flex: 0 0 40px;
    width: 40px;
    height: 40px;
    padding: 0 10px 0 20px;
    .cd {
      height: 100%;
      width: 100%;
      img {
        border-radius: 50%;
        &.playing {
          animation: rotate 10s linear infinite;
        }
        &.pause {
          animation-play-state: paused;
        }
      }
    }
  }
  .slider-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    line-height: 20px;
    overflow: hidden;
    .slider-group {
      position: relative;
      overflow: hidden;
      white-space: nowrap;
      .slider-page {
        display: inline-block;
        width: 100%;
        transform: translate3d(0, 0, 0);
        backface-visibility: hidden;
        .name {
          margin-bottom: 2px;
          @include no-wrap();
          font-size: $font-size-medium;
          color: $color-text;
        }
        .desc {
          @include no-wrap();
          font-size: $font-size-small;
          color: $color-text-d;
        }
      }
    }
  }
  .control {
    flex: 0 0 30px;
    width: 30px;
    padding: 0 10px;
    .icon-playlist {
      position: relative;
      top: -2px;
      font-size: 28px;
      color: $color-theme-d;
    }
    .icon-mini {
      position: absolute;
      left: 0;
      top: 0;
      color: $color-theme-d;
      font-size: 32px;
    }
  }
  &.mini-enter-active, &.mini-leave-active {
    transition: all 0.6s cubic-bezier(0.45, 0, 0.55, 1);
  }
  &.mini-enter-from, &.mini-leave-to {
    opacity: 0;
    transform: translate3d(0, 100%, 0)
  }
}
</style>
