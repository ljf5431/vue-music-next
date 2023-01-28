// 榜单页面的请求

import { get } from '@/service/base'
// 榜单页面列表请求 图标+前三歌曲
export function getTopList() {
  return get('/api/getTopList')
}

// 榜单详情页
export function getTopDetail(top) {
  return get('/api/getTopDetail', {
    id: top.id,
    period: top.period
  })
}
