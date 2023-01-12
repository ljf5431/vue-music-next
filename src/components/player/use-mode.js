// 播放器循环播放功能

// 获取vuex定义好的数据仓库
import { useStore } from 'vuex'
import { computed } from 'vue'
// 引入定义好的全局常量名
import { PLAY_MODE } from '@/assets/js/constant'
// 播放模式切换功能-根据播放模式切换样式
export default function useMode() {
  // 暂存vuex中的数据
  const store = useStore()
  // 获取播放器的播放模式
  const playMode = computed(() => store.state.playMode)

  // 根据播放模式切换样式
  const modeIcon = computed(() => {
    const playModeVal = playMode.value
    // 根据状态判断样式 sequence-顺序播放 loop-循环播放 random-随机播放
    return playModeVal === PLAY_MODE.sequence ? 'icon-sequence' : playModeVal === PLAY_MODE.random ? 'icon-random' : 'icon-loop'
  })

  // 播放模式点击切换
  function changeMode() {
    // 播放模式标识只能是1,2,3
    const mode = (playMode.value + 1) % 3
    store.dispatch('changeMode', mode)
  }

  return {
    modeIcon,
    changeMode
  }
}
