// 迷你播放器的滑动切换相关逻辑

import { useStore } from 'vuex'
import { ref, computed, onMounted, onUnmounted, watch, nextTick, onActivated, onDeactivated } from 'vue'
import BScroll from '@better-scroll/core'
import Slide from '@better-scroll/slide'
// Vue.use ()的作用是 通过全局方法 Vue.use () 使用插件
// 插件通常用来为 Vue 添加全局功能，可以通过全局方法 Vue.use () 使用插件 ，而且它需要在你调用 new Vue () 启动应用之前完成。
BScroll.use(Slide)

// 迷你播放器的滑动切换
export default function useMiniSlider() {
  const store = useStore()
  // 歌词区域的DOM
  const sliderWrapperRef = ref(null)
  // 核心滚动的参数配置 响应式对象
  const slider = ref(null)
  // 播放器的状态 全屏或者收起
  const fullScreen = computed(() => store.state.fullScreen)
  // 正在播放的歌曲播放列表
  const playlist = computed(() => store.state.playlist)
  // 当前列表内播放歌曲的索引
  const currentIndex = computed(() => store.state.currentIndex)

  // 出现滑动切换的判断条件
  const sliderShow = computed(() => {
    // fullScreen为false并且存在playlist播放列表
    return !fullScreen.value && !!playlist.value
  })

  // 注册一个回调函数，在组件挂载完成后执行
  onMounted(() => {
    // 定义局部变量存储 核心滚动的参数配置
    let sliderVal
    // 监听是否出现滑动切换
    watch(sliderShow, async (newSliderShow) => {
      if (newSliderShow) {
        // nextTick:下次 DOM 更新循环结束之后执行延迟回调。在修改数据之后立即使用这个方法，获取更新后的 DOM
        await nextTick()
        // 判断有无初始化过
        if (!sliderVal) {
          // 核心滚动的参数配置
          sliderVal = slider.value = new BScroll(sliderWrapperRef.value, {
            click: true,
            scrollX: true,
            scrollY: false,
            momentum: false,
            // 回弹效果
            bounce: false,
            // 屏幕滑动的过程中实时的派发 scroll 事件
            probeType: 2,
            slide: {
              // 自动播放
              autoplay: false,
              loop: true
            }
          })
          // 监听进行滑动切换page之后触发 pageX 横向的索引值
          sliderVal.on('slidePageChanged', ({ pageX }) => {
            // 提交切换过后的歌曲索引值
            store.commit('setCurrentIndex', pageX)
          })
        } else {
          // 初始化过就调用refresh进行重新计算
          sliderVal.refresh()
        }
        // 滚动到当前播放歌曲
        sliderVal.goToPage(currentIndex.value, 0, 0)
      }
    })

    // 监听currentIndex当前播放歌曲索引的变化
    watch(currentIndex, (newIndex) => {
      // 判断是否完成滚动参数初始化且满足出现滑动切换的判断条件
      if (sliderVal && sliderShow.value) {
        // 滚动到新的歌曲索引
        sliderVal.goToPage(newIndex, 0, 0)
      }
    })
    watch(playlist, async (newList) => {
      if (sliderVal && sliderShow.value && newList.length) {
        await nextTick()
        sliderVal.refresh()
      }
    })
  })

  // 注册一个回调函数，在组件实例被卸载之后调用
  onUnmounted(() => {
    if (slider.value) {
      slider.value.destroy()
    }
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
    sliderWrapperRef
  }
}
