// scroll滑动组件进一步封装

// h-渲染函数
import { h, mergeProps, withCtx, renderSlot, ref, computed, watch, nextTick } from 'vue'
import Scroll from '@/components/base/scroll/scroll'
import { useStore } from 'vuex'

export default {
  name: 'wrap-scroll',
  // 直接获取scroll组件的数据
  props: Scroll.props,
  emits: Scroll.emits,
  // 在vue中我们使用模板HTML语法组建页面的，使用render函数我们可以用js语言来构建DOM
  // 渲染模板
  render(ctx) {
    return h(Scroll, mergeProps({ ref: 'scrollRef' }, ctx.$props, {
      onScroll: (e) => {
        ctx.$emit('scroll', e)
      }
    }), {
      default: withCtx(() => {
        return [renderSlot(ctx.$slots, 'default')]
      })
    })
  },
  setup() {
    // scroll组件的实例
    const scrollRef = ref(null)
    const scroll = computed(() => {
      return scrollRef.value.scroll
    })

    const store = useStore()
    // 正在播放的歌曲播放列表
    const playlist = computed(() => store.state.playlist)

    // 监听播放列表的变化
    watch(playlist, async () => {
      await nextTick()
      scroll.value.refresh()
    })

    return {
      scrollRef,
      scroll
    }
  }
}
