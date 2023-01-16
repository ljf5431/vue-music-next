// 播放器模块切换 CD模块-歌词模块

import { ref } from 'vue'

// 播放器模块切换
export function useMiddleInteractive() {
  // 模块的位置的标识
  const currentShow = ref('cd')
  // CD模式的样式
  const middleLStyle = ref(null)
  // 歌词模块的样式
  const middleRStyle = ref(null)

  // 保留X轴的位移(坐标) 方便共享
  const touch = {}
  // 最后停留的模块位置
  let currentView = 'cd'

  // 点击时
  function onMiddleTouchStart(e) {
    // 点击时的横坐标
    touch.startX = e.touches[0].pageX
    // 点击时的纵坐标
    touch.startY = e.touches[0].pageY
    // 方向锁 锁定滑动方向
    touch.directionLocked = ''
  }

  // 按着时
  function onMiddleTouchMove(e) {
    // 手指的偏移量 现在位置 - 点击位置
    const deltaX = e.touches[0].pageX - touch.startX
    const deltaY = e.touches[0].pageY - touch.startY

    // 转换为绝对值
    const absDeltaX = Math.abs(deltaX)
    const absDeltaY = Math.abs(deltaY)
    if (!touch.directionLocked) {
      // 如果横坐标偏移大于纵坐标 说明在横向滑动
      touch.directionLocked = absDeltaX >= absDeltaY ? 'h' : 'v'
    }
    // 一开始就等于v说明在纵向偏移
    if (touch.directionLocked === 'v') {
      return
    }

    // 初始的位移 0 到 -window.innerWidth屏幕宽度 之间
    const left = currentView === 'cd' ? 0 : -window.innerWidth
    // 模块的偏移量
    const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
    // 偏移比例 保留在touch中
    touch.percent = Math.abs(offsetWidth / window.innerWidth)

    // 根据偏移比例判断是否切换模块
    if (currentView === 'cd') {
      // 在CD模块 偏移比例 超过20%
      if (touch.percent > 0.2) {
        currentShow.value = 'lyric'
      } else {
        currentShow.value = 'cd'
      }
    } else {
      // 在歌词模块 偏移比例 小过20%
      if (touch.percent < 0.8) {
        currentShow.value = 'cd'
      } else {
        currentShow.value = 'lyric'
      }
    }
    // 修改CD模式的样式
    middleLStyle.value = {
      // 透明度
      opacity: 1 - touch.percent
    }
    // 修改歌词模块的样式
    middleRStyle.value = {
      transform: `translate3d(${offsetWidth}px, 0, 0)`
    }
  }

  // 手指离开时
  function onMiddleTouchEnd(e) {
    // 偏移量
    let offsetWidth
    // 透明度
    let opacity
    if (currentShow.value === 'cd') {
      currentView = 'cd'
      offsetWidth = 0
      opacity = 1
    } else {
      currentView = 'lyric'
      offsetWidth = -window.innerWidth
      opacity = 0
    }

    // 动画效果持续时间
    const duration = 300
    // 修改CD模式的样式
    middleLStyle.value = {
      // 透明度
      opacity,
      // 过度动画的时间
      transitionDuration: `${duration}ms`
    }
    // 修改歌词模块的样式
    middleRStyle.value = {
      transform: `translate3d(${offsetWidth}px, 0, 0)`,
      // 过度动画的时间
      transitionDuration: `${duration}ms`
    }
  }
  return {
    currentShow,
    middleLStyle,
    middleRStyle,
    onMiddleTouchStart,
    onMiddleTouchMove,
    onMiddleTouchEnd
  }
}
