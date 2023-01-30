import BScroll from '@better-scroll/core'
import PullUp from '@better-scroll/pull-up'
// ObserveDOM 监听DOM的变化进行刷新
import ObserveDOM from '@better-scroll/observe-dom'
import { ref, onMounted, onUnmounted, onActivated, onDeactivated } from 'vue'

// 注册插件
BScroll.use(PullUp)
BScroll.use(ObserveDOM)

// 搜索结果组件的上拉加载相关逻辑
export default function usePullUpLoad(requestData, preventPullUpLoad) {
  // 用于实例化BScroll
  const scroll = ref(null)
  // 搜索结果组件的DOM节点-实例化BScroll需要一个容器
  const rootRef = ref(null)
  // 标志位 是否正在上拉
  const isPullUpLoad = ref(false)

  // 组件挂载时调用
  onMounted(() => {
    // 实例化BScroll 核心滚动的参数配置
    const scrollVal = scroll.value = new BScroll(rootRef.value, {
      // 上拉加载
      pullUpLoad: true,
      // 监听DOM的变化进行刷新
      observeDOM: true,
      click: true
    })

    // 监听pullingUp事件：上拉加载动作完成后会派发这事件
    scrollVal.on('pullingUp', pullingUpHandler)
    // pullingUp事件的回调函数
    async function pullingUpHandler() {
      // 判断是否存在加载组件 避免两个加载组件同时显示
      if (preventPullUpLoad.value) {
        scrollVal.finishPullUp()
        return
      }
      isPullUpLoad.value = true
      // 发送异步请求 requestData外部传入的请求API方法
      await requestData()
      // 结束上拉动作
      scrollVal.finishPullUp()
      // 重新计算可滚动高度
      scrollVal.refresh()
      isPullUpLoad.value = false
    }
  })
  // 卸载组件实例后调用
  onUnmounted(() => {
    // 销毁 BScroll，解绑事件
    scroll.value.destroy()
  })

  // 被keep-alive缓存的组件激活时调用
  onActivated(() => {
    scroll.value.enable()
    scroll.value.refresh()
  })
  // 被keep-alive缓存的组件停用时调用
  onDeactivated(() => {
    scroll.value.disable()
  })

  return {
    scroll,
    rootRef,
    isPullUpLoad
  }
}
