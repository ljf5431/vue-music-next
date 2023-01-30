import { useStore } from 'vuex'
import { PLAY_KEY } from '@/assets/js/constant'
import { save } from '@/assets/js/array-store'

// 添加到播放历史 提交到vuex
export default function usePlayHistory() {
  const store = useStore()
  // 存储的最大长度
  const maxLen = 200
  // 存储播放历史，传入当前播放的歌曲，提交到vuex管理
  function savePlay(song) {
    const songs = save(song, PLAY_KEY, (item) => {
      return item.id === song.id
    }, maxLen)
    // 提交歌曲到播放历史
    store.commit('setPlayHistory', songs)
  }
  return {
    savePlay
  }
}
