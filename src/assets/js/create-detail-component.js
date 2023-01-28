import MusicList from '@/components/music-list/music-list'
import storage from '_good-storage@1.1.1@good-storage'
import { processSongs } from '@/service/song'

// 创建详情页面的逻辑封装
export default function createDetailComponent(name, key, fetch) {
  // name-组件名 key-唯一标识id fetch-请求API 方法名
  return {
    name,
    // 调用页面传递的数据
    props: {
      data: Object
    },
    components: {
      MusicList
    },
    data() {
      return {
        // 歌手详情页的歌曲
        songs: [],
        loading: true
      }
    },
    computed: {
      computedData() {
        // 存储歌手的信息
        let ret = null
        const data = this.data
        if (data) {
          // 如果是从歌手页点击进来的正常赋值
          ret = data
        } else {
          // 如果不是的话就从缓存里读取 cachedSinger临时存储歌手的信息
          const cached = storage.session.get(key)
          // 如果有歌手的唯一标识 并且与路径的id相同说明是在当前页面进行刷新
          if (cached && (cached.mid || cached.id + '') === this.$route.params.id) {
            ret = cached
          }
        }
        return ret
      },
      // 歌手背景图
      pic() {
        const data = this.computedData
        return data && data.pic
      },
      // 歌手名
      title() {
        const data = this.computedData
        return data && (data.name || data.title)
      }
    },
    async created() {
      const data = this.computedData
      // 如果computedData为空的话直接返回上一层路由 因为查询不到歌手信息
      if (!data) {
        const path = this.$route.matched[0].path
        this.$router.push({
          path
        })
        return
      }
      const result = await fetch(data)
      this.songs = await processSongs(result.songs)
      this.loading = false
    }
  }
}
