// 推荐页的请求
import { get } from './base'
// 轮播图请求
export function getRecommend() {
  return get('/api/getRecommend')
}
// 歌单详情的请求
export function getAlbum(album) {
  return get('/api/getAlbum', {
    id: album.id
  })
}
