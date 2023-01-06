import BScroll from '@better-scroll/core'
import ObserveDOM from '@better-scroll/observe-dom'
import { onMounted, onUnmounted, onActivated, onDeactivated, ref } from 'vue'

BScroll.use(ObserveDOM)

export default function useScroll(wrapperRef, options, emit) {
  const scroll = ref(null)
  // 组件挂载时调用
  onMounted(() => {
    const scrollVal = scroll.value = new BScroll(wrapperRef.value, {
      observeDOM: true,
      ...options
    })
    // 监听位置变化
    if (options.probeType > 0) {
      scrollVal.on('scroll', (pos) => {
        // 把滚动位置信息发送出去
        emit('scroll', pos)
      })
    }
  })

  // 卸载组件实例后调用
  onUnmounted(() => {
    scroll.value.destroy()
  })
  // 被keep-alive缓存的组件激活时调用
  onActivated(() => {
    scroll.value.enable()
    scroll.value.refresh()
  })
  // 被keep-alive缓存的组件停用时调用
  onDeactivated(() => {
    scroll.value.disable()
  })

  return scroll
}
