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
