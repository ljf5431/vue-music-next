<!--歌手页面-->
<template>
  <div class="singer" v-loading="!singers.length">
    <!--自定义事件 @select 规定当发生 select 事件时运行的函数-->
    <index-list
      :data="singers"
      @select="selectSinger"
    ></index-list>
    <!--给路由组件切换添加过渡动画-->
    <router-view v-slot="{ Component }">
      <transition appear name="slide">
        <component :is="Component" :data="selectedSinger"/>
      </transition>
    </router-view>
  </div>
</template>

<script>
  import { getSingerList } from '@/service/singer'
  import IndexList from '@/components/index-list/index-list' // 歌手页面组件
  import storage from 'good-storage'// 第三方缓存库// localStorage 长期缓存（无截至日期）// sessionStorage 短期缓存（关闭浏览器清除）
  import { SINGER_KEY } from '@/assets/js/constant'

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
      this.cacheSinger(singer)
      // 路由跳转到歌手详情页
      this.$router.push({
        path: `/singer/${singer.mid}`
      })
    },
    // 缓存歌手的信息
    cacheSinger(singer) {
      // 当生成vue实例后，给原本不存在的属性赋值，赋值成功后的值并不会自动更新到视图上去，这个时候可以用Vue.set
      storage.session.set(SINGER_KEY, singer)
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
