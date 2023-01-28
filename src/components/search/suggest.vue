<template>
  <div class="suggest"
     v-loading:[loadingText]="loading"
     v-no-result:[noResultText]="noResult"
  >
    <ul class="suggest-list">
      <li
        class="suggest-item"
        v-if="singer"
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
    </ul>
  </div>
</template>

<script>
import { computed, ref, watch } from 'vue'
import { search } from '@/service/search'
import { processSongs } from '@/service/song'

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
  setup(props) {
    // 相关歌手数据
    const singer = ref(null)
    // 相关歌曲数据
    const songs = ref([])
    const hasMore = ref(true)
    // 搜索结果的页码
    const page = ref(1)
    // 修改加载中组件的文字
    const loadingText = ref('')
    // 修改没结果时无数据组件显示的文字
    const noResultText = ref('抱歉,暂无搜索结果')

    // 没数据时显示加载中组件
    const loading = computed(() => {
      return !singer.value && !songs.value.length
    })
    // 边界处理 无搜索结果时显示
    const noResult = computed(() => {
      return !singer.value && !songs.value.length && !hasMore.value
    })

    // 监听搜索框内容的变化
    watch(() => props.query, async (newQuery) => {
      if (!newQuery) {
        return
      }
      await searchFirst()
    })

    // 第一次搜索 重置一些数据
    async function searchFirst() {
      page.value = 1
      songs.value = []
      singer.value = null
      hasMore.value = true

      const result = await search(props.query, page.value, props.showSinger)
      songs.value = await processSongs(result.songs)
      singer.value = result.singer
      hasMore.value = result.hasMore
      console.log(result)
    }

    return {
      singer,
      songs,
      loading,
      loadingText,
      noResult,
      noResultText
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
