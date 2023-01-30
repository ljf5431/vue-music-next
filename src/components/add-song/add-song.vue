<!--添加歌曲到列表组件-->

<template>
<!--挂载在body下 避免受到其他组件的影响-->
  <teleport to="body">
    <transition name="slide">
      <div class="add-song" v-show="visible">
        <div class="header">
          <h1 class="title">添加歌曲到列表</h1>
          <div class="close" @click="hide">
            <i class="icon-close"></i>
          </div>
        </div>
        <div class="search-input-wrapper">
          <search-input
            v-model="query"
            placeholder="搜索歌曲"
          ></search-input>
        </div>
        <div v-show="!query">
          <!--模块切换组件-->
          <switches
            :items="['最近播放', '搜索历史']"
            v-model="currentIndex"
          ></switches>
          <!--模块对应的内容-->
          <div class="list-wrapper">
            <scroll
              v-if="currentIndex===0"
              class="list-scroll"
              ref="scrollRef"
            >
              <div class="list-inner">
                <song-list
                  :songs="playHistory"
                  @select="selectSongBySongList"
                ></song-list>
              </div>
            </scroll>
            <scroll
              v-if="currentIndex===1"
              class="list-scroll"
              ref="scrollRef"
            >
              <div class="list-inner">
                <search-list
                  :searches="searchHistory"
                  :show-delete="false"
                  @select="addQuery"
                ></search-list>
              </div>
            </scroll>
          </div>
        </div>
        <div class="search-result" v-show="query">
          <suggest
            :query="query"
            :show-singer="false"
            @select-song="selectSongBySuggest"
          ></suggest>
        </div>
        <message ref="messageRef">
          <div class="message-title">
            <i class="icon-ok"></i>
            <span class="text">当前歌曲已添加到播放列表</span>
          </div>
        </message>
      </div>
    </transition>
  </teleport>
</template>

<script>
import SearchInput from '@/components/search/search-input'
import Suggest from '@/components/search/suggest'
import Switches from '@/components/base/switches/switches'
import Scroll from '@/components/base/scroll/scroll'
import SongList from '@/components/base/song-list/song-list'
import SearchList from '@/components/base/search-list/search-list'
import Message from '@/components/base/message/message'
import { computed, nextTick, ref, watch } from 'vue'
import { useStore } from 'vuex'
import useSearchHistory from '@/components/search/use-search-history'

export default {
  name: 'add-song',
  components: {
    SearchInput,
    Suggest,
    Switches,
    Scroll,
    SongList,
    SearchList,
    Message
  },
  setup() {
    // 记录状态 展示和隐藏
    const visible = ref(false)
    // 输入框输入的关键字
    const query = ref('')
    // 模块切换的标识id
    const currentIndex = ref(0)
    // 最近播放+搜索历史对应的内容的实例
    const scrollRef = ref(null)
    // 添加成功 提示框组件的实例
    const messageRef = ref(null)

    const store = useStore()
    // 获取搜索历史列表
    const searchHistory = computed(() => store.state.searchHistory)
    // 获取播放历史列表
    const playHistory = computed(() => store.state.playHistory)
    // 搜索历史的保存与删除相关逻辑
    const { saveSearch } = useSearchHistory()

    // 监听输入框的关键词变化 实时修改可滚动区域的高度
    watch(query, async () => {
      if (!query.value) {
        await nextTick()
        refreshScroll()
      }
    })

    // 展示 添加歌曲到列表组件
    async function show() {
      visible.value = true

      await nextTick()
      refreshScroll()
    }
    // 隐藏 添加歌曲到列表组件
    function hide() {
      visible.value = false
    }
    // 重新计算可滚动区域的高度
    function refreshScroll() {
      scrollRef.value.scroll.refresh()
    }

    // 点击词条搜索：通过v-model实现数据绑定
    function addQuery(s) {
      query.value = s
    }

    // 点击播放历史列表的歌曲添加到播放列表
    function selectSongBySongList({ song }) {
      addSong(song)
    }

    // 使用搜索框搜索歌曲,完成添加到搜索历史
    function selectSongBySuggest(song) {
      // 添加到播放列表
      addSong(song)
      // 保存到搜索历史
      saveSearch(query.value)
    }

    // 点击搜索结果列表中的歌曲 添加到播放列表
    function addSong(song) {
      store.dispatch('addSong', song)
      showMessage()
    }

    // 调用提示框组件的实例内的方法显示弹窗
    function showMessage() {
      messageRef.value.show()
    }

    return {
      visible,
      query,
      scrollRef,
      messageRef,
      currentIndex,
      searchHistory,
      playHistory,
      show,
      hide,
      addQuery,
      selectSongBySongList,
      selectSongBySuggest
    }
  }
}
</script>

<style lang="scss" scoped>
.add-song {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  z-index: 300;
  background: $color-background;
  .header {
    position: relative;
    height: 44px;
    text-align: center;
    .title {
      line-height: 44px;
      font-size: $font-size-large;
      color: $color-text;
    }
    .close {
      position: absolute;
      top: 0;
      right: 8px;
      .icon-close {
        display: block;
        padding: 12px;
        font-size: 20px;
        color: $color-theme;
      }
    }
  }
  .search-input-wrapper {
    margin: 20px
  }
  .list-wrapper {
    position: absolute;
    top: 165px;
    bottom: 0;
    width: 100%;
    .list-scroll {
      height: 100%;
      overflow: hidden;
      .list-inner {
        padding: 20px 30px;
      }
    }
  }
  .search-result {
    position: fixed;
    top: 124px;
    bottom: 0;
    width: 100%;
  }
}

.message-title {
  text-align: center;
  padding: 18px 0;
  font-size: 0;
  .icon-ok {
    font-size: $font-size-medium;
    color: $color-theme;
    margin-right: 4px;
  }
  .text {
    font-size: $font-size-medium;
    color: $color-text;
  }
}
</style>
