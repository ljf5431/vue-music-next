// 播放器唱片区域的js

import { useStore } from 'vuex'
import { computed, ref, watch } from 'vue'

// 旋转唱片相关逻辑
export default function useCd() {
  // 获取唱片的DOM
  const cdRef = ref(null)
  // 获取唱片的图片的DOM
  const cdImageRef = ref(null)

  // 获取vuex中的状态
  const store = useStore()
  // 获取播放状态
  const playing = computed(() => store.state.playing)

  // 通过播放状态修改唱片的样式
  const cdCls = computed(() => {
    return playing.value ? 'playing' : ''
  })

  watch(playing, (newPlaying) => {
    // 播放暂停时
    if (!newPlaying) {
      syncTransform(cdRef.value, cdImageRef.value)
    }
  })

  // 同步唱片和内部图片的旋转角度 wrapper外层 inner内层图片
  function syncTransform(wrapper, inner) {
    // 外层容器的旋转角度
    const wrapperTransform = getComputedStyle(wrapper).transform
    // 获取内部图片的旋转角度
    const innerTransform = getComputedStyle(inner).transform
    // 第一次旋转时直接获取图片的角度 后续因为图片是相对于容器旋转，而现在容器的初始角度不是0了 所以需要把两个角度叠加
    wrapper.style.transform = wrapperTransform === 'none' ? innerTransform : innerTransform.concat('', wrapperTransform)
  }

  return {
    cdCls,
    cdRef,
    cdImageRef
  }
}
