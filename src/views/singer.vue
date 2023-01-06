<!--歌手页面-->
<template>
  <div class="singer" v-loading="!singers.length">
    <!--自定义事件 @select 规定当发生 select 事件时运行的函数-->
    <index-list
      :data="singers"
      @select="selectSinger"
    ></index-list>
    <router-view :singer="selectedSinger"></router-view>
  </div>
</template>

<script>
  import { getSingerList } from '@/service/singer'
  import IndexList from '@/components/base/index-list/index-list'

  export default {
  name: 'singer',
  components: {
    IndexList
  },
  data() {
    return {
      singers: [],
      selectedSinger: null
    }
  },
  // created生命周期：在模板渲染成html前调用，即通常初始化某些属性值，然后再渲染成视图
  async created() {
    const result = await getSingerList()
    this.singers = result.singers
    console.log(result)
  },
  methods: {
    // 传递点击的歌手
    selectSinger(singer) {
      this.selectedSinger = singer
      // 路由跳转到歌手详情页
      this.$router.push({
        path: `/singer/${singer.mid}`
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.singer {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
}
</style>
