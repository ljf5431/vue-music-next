<!--进度条组件-->
<template>
  <div
    class="progress-bar"
    @click="onClick"
  >
    <!--总进度条-->
    <div class="bar-inner">
      <div
        class="progress"
        ref="progress"
        :style="progressStyle"
      ></div>
      <div
        class="progress-btn-wrapper"
        :style="btnStyle"
        @touchstart.prevent="onTouchStart"
        @touchmove.prevent="onTouchMove"
        @touchend.prevent="onTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
const progressBtnWidth = 16

export default {
  name: 'progress-bar',
  emits: ['progress-changing', 'progress-changed'],
  props: {
    // 进度条需要的数据
    progress: {
      type: Number,
      // 默认值
      default: 0
    }
  },
  data() {
    return {
      // 默认偏移量
      offset: 0
    }
  },
  computed: {
    // 黄色动态的进度条
    progressStyle() {
      return `width:${this.offset}px`
    },
    btnStyle() {
      return `transform:translate3d(${this.offset}px, 0, 0)`
    }
  },
  watch: {
    // 监听进度条数据progress的变化，获取一个当前进度newProgress
    progress(newProgress) {
      this.setOffset(newProgress)
    }
  },
  created () {
    // 临时存储参数 共享参数
    this.touch = {}
  },
  methods: {
    // 第一次触碰到进度条时触发
    onTouchStart(e) {
      // 获取点击的横坐标
     this.touch.x1 = e.touches[0].pageX
      // 点击的位置到起点之间的宽度
      this.touch.beginWidth = this.$refs.progress.clientWidth
    },
    // 一直点着不松手的时候触发
    onTouchMove(e) {
      // 获取偏移量 移动后的横坐标 - 上一次点击位置的横坐标
      const delta = e.touches[0].pageX - this.touch.x1
      // 获取移动后进度条的宽度
      const tempWidth = this.touch.beginWidth + delta
      // 进度条的总宽度 = 整个组件的宽度 - 圆形图标的宽度
      const barWidth = this.$el.clientWidth - progressBtnWidth
      // 移动后的播放进度 限制在 0-1 之间
      const progress = Math.min(1, Math.max(tempWidth / barWidth, 0))
      // 移动过后需要偏移量
      this.offset = barWidth * progress
      // 手指没离开时派发
      this.$emit('progress-changing', progress)
    },
    // 移开的时候触发
    onTouchEnd() {
      // 进度条的总宽度 = 整个组件的宽度 - 圆形图标的宽度
      const barWidth = this.$el.clientWidth - progressBtnWidth
      // 播放进度 = 偏移量/进度条总宽度
      const progress = this.$refs.progress.clientWidth / barWidth
      // 手指离开后派发一次
      this.$emit('progress-changed', progress)
    },
    // 点击调整进度条
    onClick(e) {
      // 获取整个进度条在页面的位置 getBoundingClientRect-获取元素位置
      const rect = this.$el.getBoundingClientRect()
      // 偏移量 = 点击位置的横坐标 - 进度条组件距离页面左边的距离
      const offsetWidth = e.pageX - rect.left
      // 进度条的总宽度 = 整个组件的宽度 - 圆形图标的宽度
      const barWidth = this.$el.clientWidth - progressBtnWidth
      // 新的播放进度 = 偏移量/进度条总宽度
      const progress = offsetWidth / barWidth
      this.$emit('progress-changed', progress)
    },
    // 重新打开全屏播放器时重新获取播放进度
    setOffset(progress) {
      // 进度条的总宽度 = 整个组件的宽度 - 圆形图标的宽度
      const barWidth = this.$el.clientWidth - progressBtnWidth
      // 需要偏移的量
      this.offset = barWidth * progress
    }
  }
}
</script>

<style lang="scss" scoped>
.progress-bar {
  height: 30px;
  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    background: rgba(0, 0, 0, 0.3);
    .progress {
      position: absolute;
      height: 100%;
      background: $color-theme;
    }
    .progress-btn-wrapper {
      position: absolute;
      left: -8px;
      top: -13px;
      width: 30px;
      height: 30px;
      .progress-btn {
        position: relative;
        top: 7px;
        left: 7px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 3px solid $color-text;
        border-radius: 50%;
        background: $color-theme;
      }
    }
  }
}
</style>
