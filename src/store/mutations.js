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
  },
  // 添加收藏或者取消收藏
  setFavoriteList(state, list) {
    state.favoriteList = list
  },
  // 修改播放歌曲的歌词
  addSongLyric(state, { song, lyric }) {
    // 获取播放列表里的歌曲 给歌曲列表添加lyric(歌词)属性
    state.sequenceList.map((item) => {
      // 判断是否为同一首歌曲
      if (item.mid === song.mid) {
        item.lyric = lyric
      }
      return item
    })
  },
  // 添加到搜索历史
  setSearchHistory(state, searches) {
    // searches搜索历史数组
    state.searchHistory = searches
  },
  // 添加到播放历史
  setPlayHistory(state, songs) {
    state.playHistory = songs
  }
}

// 修改完导出
export default mutations
