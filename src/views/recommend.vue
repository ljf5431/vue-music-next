<!--推荐页面-->
<template>
  <div class="recommend" v-loading="loading">
    <scroll class="recommend-content">
      <div>
        <!--轮播图-->
        <div class="slider-wrapper">
          <div class="slider-content">
            <!--v-if="sliders.length" 没数据时不渲染-->
            <slider v-if="sliders.length" :sliders="sliders"></slider>
          </div>
        </div>
        <!--热门歌单推荐-->
        <div class="recommend-list">
          <h1 class="list-title" v-show="!loading">热门歌单推荐</h1>
          <ul>
            <li
              v-for="item in albums"
              class="item"
              :key="item.id"
              @click="selectItem(item)"
            >
              <div class="icon">
                <img width="60" height="60" v-lazy="item.pic">
              </div>
              <div class="text">
                <h2 class="name">
                  {{ item.username }}
                </h2>
                <p class="title">
                  {{ item.title }}
                </p>
              </div>
            </li>
          </ul>
        </div>

      </div>
    </scroll>
    <router-view v-slot="{ Component }">
      <transition appear name="slide">
        <component :is="Component" :data="selectedAlbum"/>
      </transition>
    </router-view>
  </div>
</template>

<script>
  import { getRecommend } from '@/service/recommend' // 轮播图的请求方法
  import Slider from '@/components/base/slider/slider' // 轮播图组件
  import Scroll from '@/components/wrap-scroll'// 滑动组件
  import storage from 'good-storage'
  import { ALBUM_KEY } from '@/assets/js/constant'

  export default {
    name: 'recommend',
    components: {
      Slider,
      Scroll
    },
    data() {
      return {
        sliders: [],
        albums: [],
        selectedAlbum: null
      }
    },
    computed: {
      loading() {
        return !this.sliders.length && !this.albums.length
      }
    },
    // 获取轮播图数据
    // async和await关键字，作为处理异步请求的一种解决方案，实际上是一个语法糖
    async created () {
      const result = await getRecommend()
      this.sliders = result.sliders
      this.albums = result.albums
      console.log(result)
    },
    methods: {
      selectItem(album) {
        this.selectedAlbum = album
        this.cacheAlbum(album)
        // 跳转到歌单详情页
        this.$router.push({
          path: `/recommend/${album.id}`
        })
      },
      // 缓存歌单的信息
      cacheAlbum(album) {
        // 当生成vue实例后，给原本不存在的属性赋值，赋值成功后的值并不会自动更新到视图上去，这个时候可以用Vue.set
        storage.session.set(ALBUM_KEY, album)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .recommend {
    position: fixed;
    width: 100%;
    top: 88px;
    bottom: 0;
    overflow: scroll;
    .recommend-content{
      height: 100%;
      overflow: hidden;
      .slider-wrapper {
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 40%;
        overflow: hidden;
        .slider-content {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
        }
      }
      .recommend-list {
        .list-title {
          height: 65px;
          line-height: 65px;
          text-align: center;
          font-size: $font-size-medium;
          color: $color-theme;
        }
        .item {
          display: flex;
          //box-sizing 属性定义如何计算一个元素的总宽度和总高度，主要设置是否需要加上内边距(padding)和边框等
          box-sizing: border-box;
          align-items: center;
          padding: 0 20px 20px 20px;
          .icon {
            flex: 0 0 60px;
            width: 60px;
            padding-right: 20px;
          }
          .text {
            display: flex;
            flex-direction: column;// 垂直地显示
            justify-content: center;
            flex: 1;
            line-height: 20px;
            overflow: hidden;
            font-size: $font-size-medium;
          }
          .name {
            margin-bottom: 10px;
            color: $color-text;
          }
          .title {
            color: $color-text-d;
          }
        }
      }
    }
  }
</style>
