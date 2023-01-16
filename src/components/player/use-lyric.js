// 歌词模块逻辑代码

import { useStore } from 'vuex'
import { computed, watch, ref } from 'vue'
import { getLyric } from '@/service/song'
import Lyric from 'lyric-parser'

// 歌词模块逻辑代码
export default function useLyric({ songReady, currentTime }) {
  // 创建lyric的对象实例 用于歌词解析
  const currentLyric = ref(null)
  // 歌词所在的行号
  const currentLineNum = ref(0)
  // 纯音乐时显示
  const pureMusicLyric = ref('')
  // CD模块下的单行歌词
  const playingLyric = ref('')
  // scroll组件的组件实例
  const lyricScrollRef = ref(null)
  // 歌词容器的DOM对象
  const lyricListRef = ref(null)

  // 临时存储状态仓库
  const store = useStore()
  // 获取当前播放的歌曲
  const currentSong = computed(() => store.getters.currentSong)

  // 监听播放歌曲的切换,获取新的歌曲
  watch(currentSong, async(newSong) => {
    // 判断歌曲是否合法
    if (!newSong.url || !newSong.id) {
      return
    }

    // 清除上首歌的状态+数据
    stopLyric()
    currentLyric.value = null
    currentLineNum.value = 0
    pureMusicLyric.value = ''
    playingLyric.value = ''

    // 点击或切歌时 发送请求歌词
    const lyric = await getLyric(newSong)
    // 提交歌曲歌词
    store.commit('addSongLyric', {
      song: newSong,
      lyric
    })
    // 如果currentSong.lyric不等于lyric 说明歌曲正在切换 直接返回重新请求
    if (currentSong.value.lyric !== lyric) {
      return
    }
    // 初始化currentLyric
    currentLyric.value = new Lyric(lyric, handleLyric)
    // 歌词长度
    const hasLyric = currentLyric.value.lines.length
    // 根据不同的数据展示不同的内容
    if (hasLyric) {
      // 判断歌曲开始播放
      if (songReady.value) {
        playLyric()
      }
    } else {
      playingLyric.value = pureMusicLyric.value = lyric.replace(/\[(\d{2}):(\d{2}):(\d{2})\]/g, '')
    }
  })

  // 同步播放歌词
  function playLyric() {
    const currentLyricVal = currentLyric.value
    if (currentLyricVal) {
      // 调用歌词解析插件的seek方法 播放歌词
      currentLyricVal.seek(currentTime.value * 1000)
    }
  }

  // 关联播放状态
  function stopLyric() {
    const currentLyricVal = currentLyric.value
    if (currentLyricVal) {
      // 调用歌词解析插件的seek方法 播放歌词
      currentLyricVal.stop()
    }
  }

  // 歌词解析的处理函数
  function handleLyric({ lineNum, txt }) {
    // 获取歌词所在的行号
    currentLineNum.value = lineNum
    // 获取CD模块下的单行歌词
    playingLyric.value = txt
    // 获取滚动组件的方法
    const scrollComp = lyricScrollRef.value
    // 可以获取到每一行的DOM
    const listEl = lyricListRef.value
    if (!listEl) {
      return
    }
    // 歌词播放超过5行时
    if (lineNum > 5) {
      const lineEl = listEl.children[lineNum - 5]
      scrollComp.scroll.scrollToElement(lineEl, 1000)
    } else {
      scrollComp.scroll.scrollTo(0, 0, 1000)
    }
  }

  return {
    currentLyric,
    currentLineNum,
    pureMusicLyric,
    playingLyric,
    lyricScrollRef,
    lyricListRef,
    stopLyric,
    playLyric
  }
}
