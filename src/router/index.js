import { createRouter, createWebHashHistory } from 'vue-router'

// import Recommend from '@/views/recommend'
// import Singer from '@/views/singer'
// import TopList from '@/views/top-list'
// import Search from '@/views/search'
// import SingerDetail from '@/views/singer-detail'
// import Album from '@/views/album'
// import TopDetail from '@/views/top-detail'
// import UserCenter from '@/views/user-center'

// 组件的异步加载，工厂函数  webpackChunkName：给预加载的文件取别名
const Recommend = () => import('@/views/recommend'/* webpackChunkName: "recommend" */)
const Singer = () => import('@/views/singer'/* webpackChunkName: "singer" */)
const TopList = () => import('@/views/top-list'/* webpackChunkName: "top-list" */)
const Search = () => import('@/views/search'/* webpackChunkName: "search" */)
const SingerDetail = () => import('@/views/singer-detail'/* webpackChunkName: "singer-detail" */)
const Album = () => import('@/views/album'/* webpackChunkName: "album" */)
const TopDetail = () => import('@/views/top-detail'/* webpackChunkName: "top-detail" */)
const UserCenter = () => import('@/views/user-center'/* webpackChunkName: "user-center" */)

const routes = [
  {
    // 访问根路径时显示推荐的路径
    path: '/',
    redirect: '/recommend'
  },
  {
    // 推荐页面路径
    path: '/recommend',
    component: Recommend,
    children: [
      {
        path: ':id',
        component: Album
      }
    ]
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
    component: TopList,
    children: [
      {
        path: ':id',
        component: TopDetail
      }
    ]
  },
  {
    // 搜索页面路径
    path: '/search',
    component: Search,
    children: [
      {
        path: ':id',
        component: SingerDetail
      }
    ]
  },
  {
    // 个人中心页面
    path: '/user',
    // 给路由单独配置切换动画
    components: {
      user: UserCenter
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

export default router
