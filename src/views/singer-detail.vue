<template>
  <div class="singer-detail">
    <music-list
      :songs="songs"
      :title="title"
      :pic="pic"
      :loading="loading"
    ></music-list>
  </div>
</template>

<script>
import { getSingerDetail } from '@/service/singer'
import { processSongs } from '@/service/song'
import MusicList from '@/components/music-list/music-list'
import storage from 'good-storage'// 第三方缓存库
import { SINGER_KEY } from '@/assets/js/constant'

export default {
  name: 'singer-detail',
  // 歌手页面传递的数据
  props: {
    singer: Object
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
    computedSinger() {
      // 存储歌手的信息
      let ret = null
      const singer = this.singer
      if (singer) {
        // 如果是从歌手页点击进来的正常赋值
        ret = singer
      } else {
        // 如果不是的话就从缓存里读取 cachedSinger临时存储歌手的信息
        const cachedSinger = storage.session.get(SINGER_KEY)
        // 如果有歌手的唯一标识 并且与路径的id相同说明是在当前页面进行刷新
        if (cachedSinger && cachedSinger.mid === this.$route.params.id) {
          ret = cachedSinger
        }
      }
      return ret
    },
    // 歌手背景图
    pic() {
      const singer = this.computedSinger
      return singer && singer.pic
    },
    // 歌手名
    title() {
      const singer = this.computedSinger
      return singer && singer.name
    }
  },
  async created() {
    // 如果computedSinger为空的话直接返回上一层路由 因为查询不到歌手信息
    if (!this.computedSinger) {
      const path = this.$route.matched[0].path
      this.$router.push({
        path
      })
      return
    }
    const result = await getSingerDetail(this.computedSinger)
    this.songs = await processSongs(result.songs)
    this.loading = false
  }
}
</script>

<style lang="scss" scoped>
  .singer-detail {
    position: fixed;
    z-index: 10;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: $color-background;
  }
</style>
