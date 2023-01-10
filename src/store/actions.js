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
