import { get } from './base'
// 歌手详情页的歌曲链接请求
export function processSongs(songs) {
  if (!songs.length) {
    // 判断歌曲数字是否为空
    return Promise.resolve(songs)
  }

  return get('/api/getSongsUrl', {
    // 获取请求的参数
    mid: songs.map((song) => {
      return song.mid
    })
  }).then((result) => {
    // map为mid的映射
    const map = result.map
    // 给歌曲添加上歌曲的url
    return songs.map((song) => {
      song.url = map[song.mid]
      return song
    }).filter((song) => {
      return song.url && song.url.indexOf('vkey') > -1
    })
  })
}

// 存储歌词
const lyricMap = {}

// 通过歌曲获取歌词
export function getLyric(song) {
  // 如果歌曲存在歌词,直接返回请求结果
  if (song.lyric) {
    return Promise.resolve(song.lyric)
  }
  // 获取歌曲id
  const mid = song.mid
  // 不同列表的同一首歌曲 直接获取存储好的歌词
  const lyric = lyricMap[mid]
  if (lyric) {
    return Promise.resolve(lyric)
  }
  // 没有歌词数据时 发送请求获取
  return get('/api/getLyric', {
    mid
  }).then((result) => {
    // 有返回歌词就显示结果 获取不到歌词就提示
    const lyric = result ? result.lyric : '[00:00:00]该歌曲暂时无法获取歌词'
    // 暂存歌词
    lyricMap[mid] = lyric
    return lyric
  })
}
