// 歌手页面请求和歌手详情页请求
import { get } from './base'

export function getSingerList() {
  return get('/api/getSingerList')
}

export function getSingerDetail(singer) {
  return get('/api/getSingerDetail', {
    mid: singer.mid
  })
}
