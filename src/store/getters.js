// getters相当于state的计算属性 state=播放器相关的状态

// 通过正在播放列表的歌曲索引得到当前播放的歌曲是什么
export const currentSong = (state) => {
  return state.playlist[state.currentIndex] || {}
}
