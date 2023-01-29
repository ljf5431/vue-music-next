<!--搜索结果组件-->

<template>
  <div class="suggest"
     ref="rootRef"
     v-loading:[loadingText]="loading"
     v-no-result:[noResultText]="noResult"
  >
    <ul class="suggest-list">
      <li
        class="suggest-item"
        v-if="singer"
        @click="selectSinger(singer)"
      >
        <div class="icon">
          <i class="icon-mine"></i>
        </div>
        <div class="name">
          <p class="text">{{ singer.name }}</p>
        </div>
      </li>
      <li
        class="suggest-item"
        v-for="song in songs"
        :key="song.id"
        @click="selectSong(song)"
      >
       <div class="icon">
         <i class="icon-music"></i>
       </div>
        <div class="name">
          <p class="text">
            {{song.singer}}-{{song.name}}
          </p>
        </div>
      </li>
      <div
        class="suggest-item"
        v-loading:[loadingText]="pullUpLoading"
      ></div>
    </ul>
  </div>
</template>

<script>
import { computed, nextTick, ref, watch } from 'vue'
import { search } from '@/service/search'
import { processSongs } from '@/service/song'
import usePullUpLoad from '@/components/search/use-pull-up-load'

export default {
  name: 'suggest',
  props: {
    query: String,
    // 搜索时是否显示歌手
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  emits: ['select-song', 'select-singer'],
  setup(props, { emit }) {
    // 相关歌手数据
    const singer = ref(null)
    // 相关歌曲数据
    const songs = ref([])
    // 是否存在更多数据
    const hasMore = ref(true)
    // 搜索结果的页码
    const page = ref(1)
    // 修改加载中组件的文字
    const loadingText = ref('')
    // 修改没结果时无数据组件显示的文字
    const noResultText = ref('抱歉,暂无搜索结果')
    // 标识数据量是否不足，不满足滚动条件
    const manualLoading = ref(false)

    // 没数据时显示加载中组件
    const loading = computed(() => {
      return !singer.value && !songs.value.length
    })
    // 判断上拉加载时显示加载中组件
    const pullUpLoading = computed(() => {
      return isPullUpLoad.value && hasMore.value
    })
    // 边界处理 无搜索结果时显示
    const noResult = computed(() => {
      return !singer.value && !songs.value.length && !hasMore.value
    })
    // 避免两个加载组件同时显示
    const preventPullUpLoad = computed(() => {
      return loading.value || manualLoading.value
    })

    const { rootRef, isPullUpLoad, scroll } = usePullUpLoad(searchMore, preventPullUpLoad)

    // 监听搜索框内容的变化
    watch(() => props.query, async (newQuery) => {
      if (!newQuery) {
        return
      }
      await searchFirst()
    })

    // 首次搜索 重置一些数据
    async function searchFirst() {
      if (!props.query) {
        return
      }
      page.value = 1
      songs.value = []
      singer.value = null
      hasMore.value = true

      const result = await search(props.query, page.value, props.showSinger)
      songs.value = await processSongs(result.songs)
      singer.value = result.singer
      hasMore.value = result.hasMore
      // nextTick:在修改数据之后立即使用这个方法，获取更新后的 DOM
      await nextTick()
      await makeItScrollable()
    }
    // 上拉加载时请求下一页数据
    async function searchMore() {
      if (!hasMore.value || !props.query) {
        return
      }
      page.value++
      const result = await search(props.query, page.value, props.showSinger)
      // 拼接上一次请求的歌曲数据
      songs.value = songs.value.concat(await processSongs(result.songs))
      hasMore.value = result.hasMore
      await nextTick()
      await makeItScrollable()
    }

    // 因为过滤了付费歌曲,单页数据不够，不满足滚动条件(内容超出容器)时 请求下一页的数据 直到超出容器
    async function makeItScrollable() {
      // 大于等于-1说明为不可滚动状态
      if (scroll.value.maxScrollY >= -1) {
        manualLoading.value = true
        await searchMore()
        manualLoading.value = false
      }
    }

    // 点击歌曲发送自定义事件把歌曲数据传递出去
    function selectSong(song) {
      emit('select-song', song)
    }
    // 点击歌手发送自定义事件把歌手数据传递出去
    function selectSinger(singer) {
      emit('select-singer', singer)
    }

    return {
      singer,
      songs,
      loading,
      loadingText,
      noResult,
      noResultText,
      pullUpLoading,
      selectSong,
      selectSinger,
      rootRef,
      isPullUpLoad
    }
  }
}
</script>

<style lang="scss" scoped>
.suggest {
  height: 100%;
  overflow: hidden;
  .suggest-list {
    padding: 0 30px;
    .suggest-item {
      display: flex;
      align-items: center;
      padding-bottom: 20px;
      .icon {
        flex: 0 0 30px;
        width: 30px;
        [class^="icon-"] {
          font-size: 14px;
          color: $color-text-d;
        }
      }
      .name {
        flex: 1;
        font-size: $font-size-medium;
        color: $color-text-d;
        overflow: hidden;
        .text {
          @include no-wrap();
        }
      }
    }
  }
}
</style>
