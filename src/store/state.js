// 全局的数据仓库

import { PLAY_MODE } from '@/assets/js/constant'

// 播放器相关的初始状态
const state = {
  // 存储原始的歌曲顺序列表数据
  sequenceList: [],
  // 真实正在播放的歌曲播放列表
  playlist: [],
  // 播放状态
  playing: false,
  // 播放模式: 初始化为顺序播放
  playMode: PLAY_MODE.sequence,
  // 当前列表内播放歌曲的索引
  currentIndex: 0,
  // 播放器的状态 全屏或者收起
  fullScreen: false
}

// 初始化完成后导出
export default state
