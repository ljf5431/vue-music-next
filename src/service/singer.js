// 歌手页面请求和歌手详情页请求
import { get } from './base'
// 歌手请求
export function getSingerList() {
  return get('/api/getSingerList')
}
// 歌手的歌曲请求
export function getSingerDetail(singer) {
  return get('/api/getSingerDetail', {
    mid: singer.mid
  })
}
