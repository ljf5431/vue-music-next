<!--迷你播放器的播放列表组件-->
<template>
  <teleport to="body">
    <transition name="list-fade">
      <div
        class="playlist"
        v-show="visible && playlist.length"
        @click="hide"
      >
        <div class="list-wrapper" @click.stop>
          <!--顶部-->
          <div class="list-header">
            <h1 class="title">
              <i
                class="icon"
                :class="modeIcon"
                @click.stop="changeMode"
              >
              </i>
              <span class="text">{{modeText}}</span>
            </h1>
          </div>
          <scroll
            class="list-content"
            ref="scrollRef"
          >
            <transition-group
              ref="listRef"
              name="list"
              tag="ul"
            >
              <li
                class="item"
                v-for="song in sequenceList"
                :key="song.id"
                @click="selectItem(song)"
              >
                <i
                  class="current"
                  :class="getCurrentIcon(song)"
                ></i>
                <span class="text">{{song.name}}</span>
                <span class="favorite" @click.stop="toggleFavorite(song)">
                  <i :class="getFavoriteIcon(song)"></i>
                </span>
                <span
                  class="delete"
                  @click.stop="removeSong(song)"
                  :class="{'disable' : removing}"
                >
                  <i class="icon-delete"></i>
                </span>
              </li>
            </transition-group>
          </scroll>
          <div class="list-footer" @click.stop="hide">
            <span>关闭</span>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script>
import Scroll from '@/components/base/scroll/scroll'
import { computed, nextTick, ref, watch } from 'vue'
import { useStore } from 'vuex'
import useMode from '@/components/player/use-mode'
import useFavorite from '@/components/player/use-favorite'

export default {
  name: 'playlist',
  components: {
    Scroll
  },
  setup() {
    // 可见标识
    const visible = ref(false)
    // 标记按钮状态 避免多次点击
    const removing = ref(false)
    // 列表的滑动区域的DOM
    const scrollRef = ref(null)
    // 播放列表的DOM
    const listRef = ref(null)

    const store = useStore()
    // 获取播放列表
    const playlist = computed(() => store.state.playlist)
    // 原始的歌曲顺序列表
    const sequenceList = computed(() => store.state.sequenceList)
    // 获取当前播放的歌曲
    const currentSong = computed(() => store.getters.currentSong)

    // 播放模式切换功能
    const { modeIcon, modeText, changeMode } = useMode()
    // 播放器收藏和取消歌曲
    const { getFavoriteIcon, toggleFavorite } = useFavorite()

    // 监听播放歌曲的变化，调用方法滚动到当前位置
    watch(currentSong, async (newSong) => {
      // 没有可见标识或者没有歌曲id说明歌曲不合法
      if (!visible.value || !newSong.id) {
        return
      }
      await nextTick()
      scrollToCurrent()
    })

    // 给当前播放歌曲添加一个 正在播放图标
    function getCurrentIcon(song) {
      if (song.id === currentSong.value.id) {
        return 'icon-play'
      }
    }

    // 打开播放列表组件
    async function show() {
      visible.value = true
      await nextTick()
      refreshScroll()
      scrollToCurrent()
    }
    // 关闭播放列表组件
    function hide() {
      visible.value = false
    }

    // 实现点击切换歌曲
    function selectItem(song) {
      const index = playlist.value.findIndex((item) => {
        return song.id === item.id
      })
      // 重新提交播放歌曲的索引
      store.commit('setCurrentIndex', index)
      // 重新提交播放状态
      store.commit('setPlayingState', true)
    }

    // 调用scroll内定义的方法 重新获取滑动区域的高度
    function refreshScroll() {
      scrollRef.value.scroll.refresh()
    }

    // 实时滚动到当前播放歌曲位置
    function scrollToCurrent() {
      // 查找当前播放歌曲的索引
      const index = sequenceList.value.findIndex((song) => {
        return currentSong.value.id === song.id
      })
      if (index === -1) {
        return
      }
      // 需要滚动到的索引位置
      const target = listRef.value.$el.children[index]
      scrollRef.value.scroll.scrollToElement(target, 300)
    }

    // 点击删除歌曲
    function removeSong(song) {
      if (removing.value) {
        return
      }
      removing.value = true
      // dispatch含有异步操作，数据提交至 actions
      store.dispatch('removeSong', song)
      setTimeout(() => {
        removing.value = false
      }, 300)
    }

    return {
      visible,
      removing,
      scrollRef,
      listRef,
      playlist,
      sequenceList,
      getCurrentIcon,
      show,
      hide,
      selectItem,
      removeSong,

      modeIcon,
      modeText,
      changeMode,

      getFavoriteIcon,
      toggleFavorite
    }
  }

}
</script>

<style lang="scss" scoped>
.playlist {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 200;
  background-color: $color-background-d;
  &.list-fade-enter-active, &.list-fade-leave-active {
    transition: opacity .3s; //opacity 代表 透明度
    .list-wrapper {
      transition: all .3s;
    }
  }
  &.list-fade-enter-from, &.list-fade-leave-to {
    opacity: 0;
    .list-wrapper {
      transform: translate3d(0, 100%, 0);
    }
  }
  .list-wrapper {
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 210;
    width: 100%;
    background-color: $color-highlight-background;
    .list-header {
      position: relative;
      padding: 20px 30px 10px 20px;
      .title {
        display: flex;
        align-items: center;
        .icon {
          margin-right: 10px;
          font-size: 24px;
          color: $color-theme-d;
        }
        .text {
          flex: 1;
          font-size: $font-size-medium;
          color: $color-text-l;
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
    .list-content {
      max-height: 240px;
      overflow: hidden;
      .item {
        display: flex;
        align-items: center;
        height: 40px;
        padding: 0 30px 0 20px;
        overflow: hidden;
        .current {
          flex: 0 0 20px;
          width: 20px;
          font-size: $font-size-small;
          color: $color-theme-d;
        }
        .text {
          flex: 1;
          @include no-wrap();
          font-size: $font-size-medium;
          color: $color-text-d;
        }
        .favorite {
          @include extend-click();
          margin-right: 15px;
          font-size: $font-size-small;
          color: $color-theme;
          .icon-favorite {
            color: $color-sub-theme;
          }
        }
        .delete {
          @include extend-click();
          font-size: $font-size-small;
          color: $color-theme;
          &.disable {
            color: $color-theme-d;
          }
        }
      }
    }
    .list-add {
      width: 140px;
      margin: 20px auto 30px auto;
      .add {
        display: flex;
        align-items: center;
        padding: 8px 16px;
        border: 1px solid $color-text-l;
        border-radius: 100px;
        color: $color-text-l;
        .icon-add {
          margin-right: 5px;
          font-size: $font-size-small-s;
        }
        .text {
          font-size: $font-size-small;
        }
      }
    }
    .list-footer {
      text-align: center;
      line-height: 50px;
      background: $color-background;
      font-size: $font-size-medium-x;
      color: $color-text-l;
    }
  }
}
</style>
