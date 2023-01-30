<!--提示框组件-->

<template>
  <teleport to="body">
    <transition name="slide-down">
      <div class="message" v-show="visible" @click="hide">
        <slot></slot>
      </div>
    </transition>
  </teleport>
</template>

<script>
export default {
  name: 'message',
  props: {
    // 显示的时间
    delay: {
      type: Number,
      default: 2000
    }
  },
  data() {
    return {
      // 控制显示-隐藏
      visible: false
    }
  },
  methods: {
    show() {
      this.visible = true
      // clearTimeout重置上一次调用的定时器
      clearTimeout(this.timer)
      // 定义定时器 定时隐藏组件
      this.timer = setTimeout(() => {
        this.hide()
      }, this.delay)
    },
    hide() {
      // clearTimeout重置上一次调用的定时器
      clearTimeout(this.timer)
      this.visible = false
    }
  }
}
</script>

<style scoped lang="scss">
.message {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 400;
  background: $color-dialog-background;
  // enter-active是控制载入时的样式名的后缀
  // leave-active 是控制消失时的样式名的后缀
  &.slide-down-enter-active, &.slide-down-leave-active {
    transition: all 0.3s
  }

  &.slide-down-enter-from, &.slide-down-leave-to {
    transform: translate3d(0, -100%, 0)
  }
}
</style>
