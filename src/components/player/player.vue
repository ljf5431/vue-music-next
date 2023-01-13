<!--播放器组件-->
<template>
  <div class="player">
    <!--fullScreen控制全屏和收起-->
    <div
      class="normal-player"
      v-show="fullScreen"
    >
      <div class="background">
        <img :src="currentSong.pic">
      </div>
      <div class="top">
        <!--收起按钮-->
        <div
          class="back"
          @click="goBack"
        >
          <i class="icon-back"></i>
        </div>
        <!--歌曲名-->
        <h1 class="title">{{currentSong.name}}</h1>
        <!--歌手名-->
        <h2 class="subtitle">{{currentSong.singer}}</h2>
      </div>
      <!--播放器唱片-->
      <div
        class="middle"
      >
        <div
          class="middle-l"
        >
          <div
            class="cd-wrapper"
          >
            <div
              class="cd"
              ref="cdRef"
            >
              <img ref="cdImageRef" class="image" :class="cdCls" :src="currentSong.pic">
            </div>
          </div>
        </div>
      </div>
      <!--播放器的按钮-->
      <div class="bottom">
        <!--播放器的进度条-->
        <div class="progress-wrapper">
          <!--当前播放时长 调用formatTime转换毫秒数-->
          <span class="time time-l">{{formatTime(currentTime)}}</span>
          <div class="progress-bar-wrapper">
            <progress-bar
              :progress="progress"
              @progress-changing="onProgressChanging"
              @progress-changed="onProgressChanged"
            ></progress-bar>
          </div>
          <!--总时长 调用formatTime转换毫秒数-->
          <span class="time time-l">{{formatTime(currentSong.duration)}}</span>
        </div>
        <!--播放器的按钮-->
        <div class="operators">
          <!--切换循环模式按钮-->
          <div class="icon i-left">
            <i @click="changeMode" :class="modeIcon"></i>
          </div>
          <!--上一首-->
          <div class="icon i-left" :class="disableCls">
            <i @click="prev" class="icon-prev"></i>
          </div>
          <!--播放暂停-开始-->
          <div class="icon i-center" :class="disableCls">
            <i @click="togglePlay" :class="playIcon"></i>
          </div>
          <!--下一首-->
          <div class="icon i-right" :class="disableCls">
            <i @click="next" class="icon-next"></i>
          </div>
          <!--收藏按钮-->
          <div class="icon i-right">
            <i @click="toggleFavorite(currentSong)" :class="getFavoriteList(currentSong)"></i>
          </div>
        </div>
      </div>
    </div>
    <!--定义声音-->
    <audio
      ref = 'audioRef'
      @pause="pause"
      @canplay="ready"
      @error="error"
      @timeupdate="updateTime"
      @ended="end"
    ></audio>
  </div>
</template>

<script>
// useStore ===vue2.0中的this.$store 引用vuex中定义好的数据仓库
import { useStore } from 'vuex'
// watch监测Vue实例变化的一个表达式或方法。回调函数得到的参数为新值newValue和旧值oldValue
import { computed, watch, ref } from 'vue'// 设置计算属性 动态修改页面状态
import useMode from '@/components/player/use-mode'
import useFavorite from './use-favorite'
import useCd from '@/components/player/use-cd'
import ProgressBar from '@/components/player/progress-bar'
import { formatTime } from '@/assets/js/util'
import { PLAY_MODE } from '@/assets/js/constant'

export default {
  name: 'player',
  components: {
    ProgressBar
  },
  setup() {
    // data
    // audioRef 歌曲的音频url
    const audioRef = ref(null)
    // 缓冲状态 等歌曲缓存完成 避免按钮点击过快报错
    const songReady = ref(false)
    // 当前播放时长
    const currentTime = ref(0)
    // 定义标识 用于判断是拖动进度条还是正常播放
    let progressChanging = false

    // 暂存vuex中定义好的数据仓库
    const store = useStore()
    // 获取播放器状态
    const fullScreen = computed(() => store.state.fullScreen)
    // 获取正在播放歌曲在列表的索引得到当前播放的歌曲是什么
    const currentSong = computed(() => store.getters.currentSong)
    // 获取歌曲的播放暂停状态
    const playing = computed(() => store.state.playing)
    // 获取当前播放的歌曲索引
    const currentIndex = computed(() => store.state.currentIndex)
    // 获取播放器的播放模式
    const playMode = computed(() => store.state.playMode)

    // hooks
    // 播放模式切换功能-根据播放模式切换样式
    const { changeMode, modeIcon } = useMode()
    // 播放器收藏和取消歌曲以及样式的同步修改
    const { getFavoriteList, toggleFavorite } = useFavorite()
    // 旋转唱片相关逻辑
    const { cdCls, cdRef, cdImageRef } = useCd()

    // computed 播放器组件的计算属性
    // 获取当前的播放歌曲列表
    const playlist = computed(() => store.state.playlist)
    // 根据播放状态修改播放按钮的样式
    const playIcon = computed(() => {
      // true的话icon-pause false的话icon-play
      return playing.value ? 'icon-pause' : 'icon-play'
    })

    // 播放进度 = 已播放时间 除以 总时长
    const progress = computed(() => {
      return currentTime.value / currentSong.value.duration
    })

    // 当用户点击过快时修改按钮修改为禁用样式
    const disableCls = computed(() => {
      // true时不添加 false时添加 disable样式
      return songReady.value ? '' : 'disable'
    })

    // watch Api 监听数据变化
    // 监听currentSong的变化 获取歌曲音频的URL
    watch(currentSong, (newSong) => {
      // 判断存不存在歌曲id或者URL
      if (!newSong.id || !newSong.url) {
        return
      }
      // 当歌曲发生改变时重置已播放时长
      currentTime.value = 0
      // url发生改变时修改缓冲状态
      songReady.value = false
      // 获取audio标签的DOM对象
      const audioEl = audioRef.value
      // 把获取到的音频url赋值给audioEl的src属性
      audioEl.src = newSong.url
      // 调用play方法进行播放音频
      audioEl.play()
    })

    // 监听播放暂停按钮的状态，实现音频的播放和暂停
    watch(playing, (newPlaying) => {
      // 判断缓冲状态是否完成
      if (!songReady.value) {
        return
      }
      // 获取audio标签的DOM对象
      const audioEl = audioRef.value
      // 根据按钮的整体实现音频的播放和暂停
      newPlaying ? audioEl.play() : audioEl.pause()
    })

    // 播放暂停按钮
    function togglePlay() {
      // 判断缓冲状态是否完成
      if (!songReady.value) {
        return
      }
      // 把播放器的状态取反 然后提交到vuex
      store.commit('setPlayingState', !playing.value)
    }

    // methods 方法
    // 点击上一首按钮
    function prev() {
      const list = playlist.value
      // 列表中没有数据或者缓冲没加载完时直接返回 什么都不做
      if (!songReady.value || !list.length) {
        return
      }
      // 当播放列表内只有一首歌时
      if (list.length === 1) {
        loop()
      } else {
        // 多首歌曲时
        let index = currentIndex.value - 1
        // 索引为最后一首歌时 就切换到列表的第一首
        if (index === -1) {
          index = list.length - 1
        }
        // 把当前的歌曲索引提交到vuex
        store.commit('setCurrentIndex', index)
        // 如果播放器为暂停状态则点击上一首的同时修改为播放状态
        if (!playing.value) {
          store.commit('setPlayingState', true)
        }
      }
    }
    // 点击下一首按钮
    function next() {
      const list = playlist.value
      // 列表中没有数据或者缓冲没加载完时直接返回 什么都不做
      if (!songReady.value || !list.length) {
        return
      }
      // 当播放列表内只有一首歌时
      if (list.length === 1) {
        loop()
      } else {
        // 多首歌曲时
        let index = currentIndex.value + 1
        // 索引为最后一首歌时 就切换到列表的第一首
        if (index === list.length) {
          index = 0
        }
        // 把当前的歌曲索引提交到vuex
        store.commit('setCurrentIndex', index)
        // 如果播放器为暂停状态则点击上一首的同时修改为播放状态
        if (!playing.value) {
          store.commit('setPlayingState', true)
        }
      }
    }

    // 列表只有一首歌时循环播放当前歌曲
    function loop() {
      const audioEl = audioRef.value
      // currentTime属性设置或返回音频播放的当前位置 设置为0 从头开始
      audioEl.currentTime = 0
      audioEl.play()
      store.commit('setPlayingState', true)
    }

    // 收起播放器按钮
    function goBack() {
      // 把播放器组件的状态修改为false然后提交到vuex
      store.commit('setFullScreen', false)
    }

    // 当不是用户进行交互触发的歌曲播放状态改变 调用@pause把状态改为暂停
    function pause() {
      store.commit('setPlayingState', false)
    }

    // 给歌曲播放设置一个缓冲状态 缓冲好了才允许切换歌曲
    function ready() {
      // 执行过了就直接返回
      if (songReady.value) {
        return
      }
      songReady.value = true
    }

    // 设置歌曲音频有问题时 把缓冲状态设置为true 避免无法播放也不能切换的问题
    function error() {
      songReady.value = true
    }

    // 获取歌曲的总时长 通过audio标签的原生属性的回调
    function updateTime(e) {
      // 取反 非拖动进度条时执行
      if (!progressChanging) {
        currentTime.value = e.target.currentTime
      }
    }

    // 拖动进度条-手指没离开进度条时
    function onProgressChanging(progress) {
      progressChanging = true
      // 已播放时间 = 总时长 * 播放进度
      currentTime.value = currentSong.value.duration * progress
    }

    // 拖动进度条-手指离开进度条时
    function onProgressChanged(progress) {
      //
      progressChanging = false
      // 同步播放时间：音频的播放时间 = 当前的播放时间 = 拖动完成后的播放时间
      audioRef.value.currentTime = currentTime.value = currentSong.value.duration * progress
      // 播放器暂停时，取消暂停
      if (!playing.value) {
        store.commit('setPlayingState', true)
      }
    }

    // 歌曲播放结束后自动播放下一首
    function end() {
      // 把播放时间重置
      currentTime.value = 0
      // 判断是不是循环模式
      if (playMode.value === PLAY_MODE.loop) {
        loop()
      } else {
        next()
      }
    }

    return {
      audioRef,
      fullScreen,
      currentTime,
      currentSong,
      playIcon,
      disableCls,
      progress,
      togglePlay,
      prev,
      next,
      changeMode,
      modeIcon,
      toggleFavorite,
      getFavoriteList,
      updateTime,
      formatTime,
      onProgressChanging,
      onProgressChanged,
      end,
      goBack,
      pause,
      ready,
      error,
      // 唱片cd
      cdCls,
      cdRef,
      cdImageRef
    }
  }
}
</script>

<style lang="scss" scoped>
.player {
  .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: $color-background;
    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      // 设置透明度
      opacity: 0.6;
      // 对图像应用模糊效果
      filter: blur(20px);

      img {
        width: 100%;
        height: 100%;
      }
    }
    .top {
      position: relative;
      margin-bottom: 25px;
      .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;
      }
      .icon-back {
        display: block;
        padding: 9px;
        font-size: $font-size-large-x;
        color: $color-theme;
        // 定义 2D 旋转
        transform: rotate(-90deg);
      }
      .title {
        width: 70%;
        margin: 0 auto;
        line-height: 40px;
        text-align: center;
        @include no-wrap();
        font-size: $font-size-large;
        color: $color-text;
      }
      .subtitle {
        line-height: 20px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-text;
      }
    }
    .middle {
      position: fixed;
      width: 100%;
      top: 80px;
      bottom: 170px;
      white-space: nowrap;
      font-size: 0;
      .middle-l {
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;
        .cd-wrapper {
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          box-sizing: border-box;
          height: 100%;
          .cd {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            img {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              border-radius: 50%;
              border: 10px solid rgba(255, 255, 255, 0.1);
            }
            .playing {
              // animation: rotate平面顺时针或者逆时针旋转 linear匀速 infinite无限循环
              animation: rotate 20s linear infinite
            }
          }
        }
        .playing-lyric-wrapper {
          width: 80%;
          margin: 30px auto 0 auto;
          overflow: hidden;
          text-align: center;
          .playing-lyric {
            height: 20px;
            line-height: 20px;
            font-size: $font-size-medium;
            color: $color-text-l;
          }
        }
      }
      .middle-r {
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;
        .lyric-wrapper {
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;
          .text {
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;
            &.current {
              color: $color-text;
            }
          }
          .pure-music {
            padding-top: 50%;
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;
          }
        }
      }
    }
    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;
      .dot-wrapper {
        text-align: center;
        font-size: 0;
        .dot {
          display: inline-block;
          vertical-align: middle;
          margin: 0 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: $color-text-l;
          &.active {
            width: 20px;
            border-radius: 5px;
            background: $color-text-ll;
          }
        }
      }
      .progress-wrapper {
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0 auto;
        padding: 10px 0;
        .time {
          color: $color-text;
          font-size: $font-size-small;
          // 设置了弹性项目如何增大或缩小以适应其弹性容器中可用的空间
          flex: 0 0 40px;
          line-height: 30px;
          width: 40px;
          &.time-l {
            text-align: left;
          }
          &.time-r {
            text-align: right;
          }
        }
        .progress-bar-wrapper {
          flex: 1;
        }
      }
      .operators {
        display: flex;
        align-items: center;
        .icon {
          flex: 1;
          color: $color-theme;
          &.disable {
            color: $color-theme-d;
          }
          i {
            font-size: 30px;
          }
        }
        .i-left {
          text-align: right;
        }
        .i-center {
          padding: 0 20px;
          text-align: center;
          i {
            font-size: 40px;
          }
        }
        .i-right {
          text-align: left
        }
        .icon-favorite {
          color: $color-sub-theme;
        }
      }
    }
    &.normal-enter-active, &.normal-leave-active {
      //添加过度效果
      transition: all .6s;
      .top, .bottom {
        //从开始到结束的不同速度过渡效果
        transition: all .6s cubic-bezier(0.45, 0, 0.55, 1);
      }
    }
    &.normal-enter-from, &.normal-leave-to {
      //设置透明度
      opacity: 0;
      .top {
        //3D 空间内移动一个元素的位置 (横坐标，纵坐标，z坐标)
        transform: translate3d(0, -100px, 0);
      }
      .bottom {
        transform: translate3d(0, 100px, 0)
      }
    }
  }
}
</style>
