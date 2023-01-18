// 迷你播放器全屏播放器切换时CD的动画效果

import { ref } from 'vue'
import animations from 'create-keyframe-animation'
// 迷你播放器全屏播放器切换时CD的动画效果
export default function useAnimation() {
  const cdWrapperRef = ref(null)
  // 标识
  let entering = false
  let leaving = false

  // 迷你CD进入全屏CD的动画效果
  function enter(el, done) {
    // 迷你cd进入全屏CD动画没完成提前切换 移除未完成的动画效果
    if (leaving) {
      afterLeave()
    }
    entering = true
    const { x, y, scale } = getPosAndScale()
    // 定义过度效果
    const animation = {
      0: {
        transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
      },
      100: {
        transform: 'translate3d(0, 0, 0) scale(1)'
      }
    }
    // 注册动画
    animations.registerAnimation({
      name: 'move',
      animation,
      presets: {
        // 持续时间
        duration: 600,
        // 从开始到结束的不同速度过渡效果
        easing: 'cubic-bezier(0.45, 0, 0.55, 1)'
      }
    })
    animations.runAnimation(cdWrapperRef.value, 'move', done)
  }
  // 移除迷你CD进入全屏CD的动画效果
  function afterEnter() {
    entering = false
    animations.unregisterAnimation('move')
    cdWrapperRef.value.style.animation = ''
  }

  // 全屏CD进入迷你CD的动画效果
  function leave(el, done) {
    // 全屏CD进入迷你cd动画没完成提前切换 移除未完成的动画效果
    if (entering) {
      afterEnter()
    }
    leaving = true
    const { x, y, scale } = getPosAndScale()
    // 获取动画对象的DOM
    const cdWrapperEl = cdWrapperRef.value

    cdWrapperEl.style.transition = 'all .6s cubic-bezier(0.45, 0, 0.55, 1)'
    cdWrapperEl.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
    // addEventListener事件监听 transitionend事件CSS完成过渡后触发 定义好的next
    cdWrapperEl.addEventListener('transitionend', next)
    // 过度效果完成后移除
    function next() {
      // removeEventListener移除事件的监听
      cdWrapperEl.removeEventListener('transitionend', next)
      // 完成
      done()
    }
  }
  // 移除全屏CD进入迷你CD的动画效果
  function afterLeave() {
    leaving = false
    // 获取动画对象的DOM
    const cdWrapperEl = cdWrapperRef.value
    // 移除过度动画样式
    cdWrapperEl.style.transition = ''
    cdWrapperEl.style.transform = ''
  }

  // 计算偏移量
  function getPosAndScale() {
    // 迷你CD的宽度
    const targetWidth = 40
    // 圆心到左边的距离 圆的半径+左边距
    const paddingLeft = 40
    // 圆心到底部的距离 圆的半径+下边距
    const paddingBottom = 30
    // 正常CD的上边距
    const paddingTop = 80
    // 正常CD的宽度 屏幕的80%
    const width = window.innerWidth * 0.8
    // X坐标的偏移量
    const x = -(window.innerWidth / 2 - paddingLeft)
    // Y坐标的偏移量
    const y = window.innerHeight - paddingTop - width / 2 - paddingBottom
    // 缩放比例
    const scale = targetWidth / width
    return {
      x,
      y,
      scale
    }
  }

  return {
    cdWrapperRef,
    enter,
    afterEnter,
    leave,
    afterLeave
  }
}
