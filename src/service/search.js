// 搜索页的请求
import { get } from '@/service/base'
// 热门收索内容
export function getHotKeys() {
  return get('/api/getHotKeys')
}
// 搜索内容请求
export function search(query, page, showSinger) {
  return get('/api/search', {
    // 搜索框输入的内容
    query,
    // 页码
    page,
    showSinger
  })
}
