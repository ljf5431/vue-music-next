// 修改state的原始数据 播放器的初始状态

const mutations = {
  // 修改播放状态
  setPlayingState(state, playing) {
    state.playing = playing
  },
  // 修改原始的歌曲顺序列表数据
  setSequenceList(state, list) {
    state.sequenceList = list
  },
  // 修改正在播放的歌曲播放列表
  setPlaylist(state, list) {
    state.playlist = list
  },
  // 修改播放模式
  setPlayMode(state, mode) {
    state.playMode = mode
  },
  // 修改当前播放歌曲的索引
  setCurrentIndex(state, index) {
    state.currentIndex = index
  },
  // 修改播放组件的状态 全屏或者收起
  setFullScreen(state, fullScreen) {
    state.fullScreen = fullScreen
  }
}

// 修改完导出
export default mutations
