<template>
  <div class="search">
    <!--搜索框-->
    <div class="search-input-wrapper">
      <search-input v-model="query"></search-input>
    </div>
    <!--热门搜索+历史-->
    <scroll
      ref="scrollRef"
      class="search-content"
      v-show="!query"
    >
      <div>
        <!--热门搜索-->
        <div class="hot-keys">
          <h1 class="title">热门搜索</h1>
          <ul>
            <li
              class="item"
              v-for="item in hotKeys"
              :key="item.id"
              @click="addQuery(item.key)"
            >
              <span>{{item.key}}</span>
            </li>
          </ul>
        </div>
        <!--搜索历史-->
        <div class="search-history" v-show="searchHistory.length">
          <h1 class="title">
            <span class="text">搜索历史</span>
            <span class="clear" @click="showConfirm">
              <i class="icon-clear"></i>
            </span>
          </h1>
          <confirm
            ref="confirmRef"
            text="是否清空所有搜索历史"
            confirm-btn-text="清空"
            @confirm="clearSearch"
          ></confirm>
          <search-list
            :searches="searchHistory"
            @select="addQuery"
            @delete="deleteSearch"
          ></search-list>
        </div>
      </div>
    </scroll>
    <div class="search-result" v-show="query">
      <suggest
        :query="query"
        @select-song="selectSong"
        @select-singer="selectSinger"
      ></suggest>
    </div>
    <!---->
    <router-view v-slot="{ Component }">
      <transition appear name="slide">
        <component :is="Component" :data="selectedSinger"/>
      </transition>
    </router-view>
  </div>
</template>

<script>
import SearchInput from '@/components/search/search-input'
import Suggest from '@/components/search/suggest'
import SearchList from '@/components/base/search-list/search-list'
import Scroll from '@/components/wrap-scroll'
import Confirm from '@/components/base/confirm/confirm'
import { computed, nextTick, ref, watch } from 'vue'
import { getHotKeys } from '@/service/search'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import storage from 'good-storage'
import { SINGER_KEY } from '@/assets/js/constant'
import useSearchHistory from '@/components/search/use-search-history'

export default {
  name: 'search',
  components: {
    Scroll,
    SearchInput,
    Suggest,
    SearchList,
    Confirm
  },
  setup() {
    // 绑定输入框的内容
    const query = ref('')
    // 热门搜索词
    const hotKeys = ref([])
    // 点击的歌手
    const selectedSinger = ref(null)
    // 热门搜索+历史的实例访问到scroll变量
    const scrollRef = ref(null)
    //  弹窗组件的组件实例
    const confirmRef = ref(null)

    const store = useStore()
    // 获取 搜索历史数组
    const searchHistory = computed(() => store.state.searchHistory)

    const { saveSearch, deleteSearch, clearSearch } = useSearchHistory()

    const router = useRouter()

    // 请求热门搜索内容
    getHotKeys().then((result) => {
      hotKeys.value = result.hotKeys
    })

    // 监听搜索框内容是否发送变化 发生变化就重新计算可滚动高度
    watch(query, async (newQuery) => {
      if (!newQuery) {
        await nextTick()
        refreshScroll()
      }
    })
    // 重新计算热门搜索+历史内容的可滚动高度
    function refreshScroll() {
      scrollRef.value.scroll.refresh()
    }

    // 点击热门词条搜索：通过v-model实现数据绑定
    function addQuery(s) {
      query.value = s
    }

    // 点击搜索结果列表的歌曲 添加到播放列表
    function selectSong(song) {
      // 调用方法保存这个关键字到本地，并提交到vuex
      saveSearch(query.value)
      store.dispatch('addSong', song)
    }
    // 点击搜索结果的歌手打开歌手详情页
    function selectSinger(singer) {
      // 调用方法保存这个关键字到本地，并提交到vuex
      saveSearch(query.value)
      selectedSinger.value = singer
      cacheSinger(singer)
      // 路由跳转到详情页
      router.push({
        path: `/search/${singer.mid}`
      })
    }
    // 缓存歌手的信息
    function cacheSinger(singer) {
      // 当生成vue实例后，给原本不存在的属性赋值，赋值成功后的值并不会自动更新到视图上去，这个时候可以用Vue.set
      storage.session.set(SINGER_KEY, singer)
    }

    function showConfirm() {
      confirmRef.value.show()
    }

    return {
      scrollRef,
      confirmRef,
      query,
      hotKeys,
      selectedSinger,
      searchHistory,
      addQuery,
      selectSong,
      selectSinger,
      showConfirm,
      deleteSearch,
      clearSearch
    }
  }

}
</script>

<style lang="scss" scoped>
.search {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  display: flex;
  flex-direction: column;
  .search-input-wrapper {
    margin: 20px;
  }
  .search-content {
    flex: 1;
    overflow: hidden;
    .hot-keys {
      margin: 0 20px 20px 20px;
      .title {
        margin-bottom: 20px;
        font-size: $font-size-medium;
        color: $color-text-l;
      }
      .item {
        display: inline-block;
        padding: 5px 10px;
        margin: 0 20px 10px 0;
        border-radius: 6px;
        background: $color-highlight-background;
        font-size: $font-size-medium;
        color: $color-text-d;
      }
    }
    .search-history {
      position: relative;
      margin: 0 20px;
      .title {
        display: flex;
        align-items: center;
        height: 40px;
        font-size: $font-size-medium;
        color: $color-text-l;
        .text {
          flex: 1;
        }
        .clear {
          @include extend-click();
          .icon-clear {
            font-size: $font-size-medium;
            color: $color-text-d;
          }
        }
      }
    }
  }
  .search-result {
    flex: 1;
    overflow: hidden;
  }
}
</style>
