// 引入滑动组件
import BScroll from '@better-scroll/core'
import Slide from '@better-scroll/slide'
// 引入vue的生命周期和ref
import { onMounted, onUnmounted, onActivated, onDeactivated, ref } from 'vue'

// Vue.use ()的作用是 通过全局方法 Vue.use () 使用插件
// 插件通常用来为 Vue 添加全局功能，可以通过全局方法 Vue.use () 使用插件 ，而且它需要在你调用 new Vue () 启动应用之前完成。
BScroll.use(Slide)

export default function useSlider(wrapperRef) {
  const slider = ref(null)
  // 获取当前图片在坐标上的页码
  const currentPageIndex = ref(0)
  // 组件挂载时调用
  onMounted(() => {
    // 核心滚动的参数配置
    const sliderVal = slider.value = new BScroll(wrapperRef.value, {
      click: true,
      scrollX: true,
      scrollY: false,
      momentum: false,
      bounce: false,
      probeType: 2,
      slide: true
    })
    sliderVal.on('slideWillChange', (page) => {
      // pageX 横坐标上的页码
      currentPageIndex.value = page.pageX
    })
  })
  // 卸载组件实例后调用
  onUnmounted(() => {
    slider.value.destroy()
  })
  // 被keep-alive缓存的组件激活时调用
  onActivated(() => {
    slider.value.enable()
    slider.value.refresh()
  })
  // 被keep-alive缓存的组件停用时调用
  onDeactivated(() => {
    slider.value.disable()
  })

  return {
    slider,
    currentPageIndex
  }
}
