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
  // 在新的列表里查找原来播放的歌曲的id
  const index = state.playlist.findIndex((song) => {
    return song.id === currentId
  })
  // 把原来正在播放的歌曲重新提交 避免切换模式时歌曲也切换了
  commit('setCurrentIndex', index)
  // 重新提交播放模式 mode播放模式标识 在PLAY_MODE定义的标识
  commit('setPlayMode', mode)
}
