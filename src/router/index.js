import { createRouter, createWebHashHistory } from 'vue-router'

import Recommend from '@/views/recommend'
import Singer from '@/views/singer'
import TopList from '@/views/top-list'
import Search from '@/views/search'
import SingerDetail from '@/views/singer-detail'

const routes = [
  {
    // 访问根路径时显示推荐的路径
    path: '/',
    redirect: '/recommend'
  },
  {
    // 推荐页面路径
    path: '/recommend',
    component: Recommend
  },
  {
    // 歌手页面路径
    path: '/singer',
    component: Singer,
    // 配置子页面的路由
    children: [
      {
        path: ':id',
        component: SingerDetail
      }
    ]
  },
  {
    // 排行页面路径
    path: '/top-list',
    component: TopList
  },
  {
    // 搜索页面路径
    path: '/search',
    component: Search
  }
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

export default router
