// 相当于多个mutations集合

import { PLAY_MODE } from '@/assets/js/constant'
import { shuffle } from '@/assets/js/util'

// 选择顺序播放的歌曲的操作
export function selectPlay({ commit }, { list, index }) {
  // 第一个参数：一个对象 第二个参数 传入list播放列表, index播放歌曲索引
  // 提交播放模式 默认顺序播放
  commit('setPlayMode', PLAY_MODE.sequence)
  // 提交歌曲顺序列表数据
  commit('setSequenceList', list)
  // 修改播放状态
  commit('setPlayingState', true)
  // 修改播放器的状态为全屏 全屏或者收起
  commit('setFullScreen', true)
  // 提交正在播放的歌曲播放列表
  commit('setPlaylist', list)
  // 当前播放的歌曲索引
  commit('setCurrentIndex', index)
}

// 选择随机播放歌曲的操作
export function randomPlay({ commit }, list) {
  // 第一个参数：一个对象 第二个参数 传入list播放列表,随机播放的话不需要索引
  // 提交播放模式 默认顺序播放
  commit('setPlayMode', PLAY_MODE.random)
  // 提交歌曲顺序列表数据
  commit('setSequenceList', list)
  // 修改播放状态
  commit('setPlayingState', true)
  // 修改播放器的状态为全屏 全屏或者收起
  commit('setFullScreen', true)
  // 调用洗牌函数打乱列表 提交正在播放的歌曲播放列表
  commit('setPlaylist', shuffle(list))
  // 播放以索引为0的歌曲
  commit('setCurrentIndex', 0)
}

// 点击切换播放模式
export function changeMode({ commit, state, getters }, mode) { // mode=Playlist播放列表
  // 缓存切换模式时正在播放的歌曲索引
  const currentId = getters.currentSong.id
  // 切换到随机播放模式时
  if (mode === PLAY_MODE.random) {
    // 调用洗牌函数打乱列表 然后提交播放器原来的歌曲顺序列表
    commit('setPlaylist', shuffle(state.sequenceList))
  } else {
    // 顺序-循环模式 直接提交播放器原来的歌曲顺序列表
    commit('setPlaylist', state.sequenceList)
  }
  // 在新列表里查找原来播放的歌曲的id
  const index = state.playlist.findIndex((song) => {
    return song.id === currentId
  })
  // 把原来正在播放的歌曲重新提交 避免切换模式时歌曲也切换了
  commit('setCurrentIndex', index)
  // 重新提交播放模式 mode播放模式标识 在PLAY_MODE定义的标识
  commit('setPlayMode', mode)
}

// 点击实现删除播放列表中的某首歌
export function removeSong({ commit, state }, song) {
  // 获取歌曲顺序列表
  const sequenceList = state.sequenceList.slice()
  // 正在播放的歌曲播放列表
  const playlist = state.playlist.slice()

  // 查找当前歌曲在两个列表中的索引
  const sequenceIndex = findIndex(sequenceList, song)
  const playIndex = findIndex(playlist, song)
  // 歌曲索引小于0说明没找到歌曲
  if (sequenceIndex < 0 || playIndex < 0) {
    return
  }
  // 删除歌曲
  sequenceList.splice(sequenceIndex, 1)
  playlist.splice(playIndex, 1)
  // 删除播放歌曲之前的 索引需要-1
  let currentIndex = state.currentIndex
  if (playIndex < currentIndex || currentIndex === playlist.length) {
    currentIndex--
  }
  // 重新提交歌曲状态
  commit('setSequenceList', sequenceList)
  commit('setPlaylist', playlist)
  commit('setCurrentIndex', currentIndex)
  // 删完全部歌曲时停止播放
  if (!playlist.length) {
    commit('setPlayingState', false)
  }
}

// 清空播放列表
export function clearSongList({ commit }) {
  // 重置并提交歌曲状态
  commit('setSequenceList', [])
  commit('setPlaylist', [])
  commit('setCurrentIndex', 0)
  commit('setPlayingState', false)
}

// 点击搜索结果列表中的歌曲 添加到播放列表
export function addSong({ commit, state }, song) {
  // 正在播放的歌曲播放列表
  const playlist = state.playlist.slice()
  // 获取歌曲顺序列表
  const sequenceList = state.sequenceList.slice()
  // 列表内播放歌曲的索引
  let currentIndex = state.currentIndex
  // 在playlist中查找这首歌
  const playIndex = findIndex(playlist, song)

  // playIndex大于-1说明列表存在这首歌的索引值
  if (playIndex > -1) {
    // 修改当前播放歌曲的索引为playIndex
    currentIndex = playIndex
  } else {
    // 添加到播放列表中
    playlist.push(song)
    // 修改当前播放歌曲的索引为playlist的最后一首
    currentIndex = playlist.length - 1
  }

  // 在原始的播放列表中查找这首歌曲索引 没有则添加到列表
  const sequenceIndex = findIndex(sequenceList, song)
  if (sequenceIndex === -1) {
    sequenceList.push(song)
  }

  // 提交修改过的歌曲状态
  commit('setSequenceList', sequenceList)
  commit('setPlaylist', playlist)
  commit('setCurrentIndex', currentIndex)
  commit('setPlayingState', true)
  commit('setFullScreen', true)
}

// 查找歌曲在列表的索引的方法
function findIndex(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}
