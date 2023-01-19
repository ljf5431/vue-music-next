import { ref, computed } from 'vue'

export default function useShortcut(props, groupRef) {
  // ANCHOR_HEIGHT 单个快速导航栏标题的高度
  const ANCHOR_HEIGHT = 18
  // 通过scroll组件实例访问到scroll变量
  const scrollRef = ref(null)

  // 字母标题
  const shortcutList = computed(() => {
    return props.data.map((group) => {
      return group.title
    })
  })
  // touch 存储目标列表现在的位置信息
  const touch = {}

  // 点击滚动到目标列表位置
  function onShortcutTouchStart (e) {
    // anchorIndex列表标题的索引
    // e.target 取得的是事件发生的对象，即事件源，它是 DOM 对象
    // e.target.dataset获取元素的值
    const anchorIndex = parseInt(e.target.dataset.index)
    // 第一次移动后的纵坐标
    touch.y1 = e.touches[0].pageY
    // 拿到列表标题的索引
    touch.anchorIndex = anchorIndex
    scrollTo(anchorIndex)
  }

  // 长按拖动到目标列表位置
  function onShortcutTouchMove (e) {
    // 第二次移动后的纵坐标
    touch.y2 = e.touches[0].pageY
    // delta 向下偏移量
    const delta = (touch.y2 - touch.y1) / ANCHOR_HEIGHT | 0
    const anchorIndex = touch.anchorIndex + delta
    scrollTo(anchorIndex)
  }

  // 移动到对应的标题位置
  function scrollTo(index) {
    // 判断传递过来的是不是数字
    if (isNaN(index)) {
      return
    }
    // 限制可拖动范围 最大值跟最小值
    index = Math.max(0, Math.min(shortcutList.value.length - 1, index))
    // 对应滚动的位置=对应目标的索引值
    const targetEl = groupRef.value.children[index]
    const scroll = scrollRef.value.scroll
    // .scrollToElement 滚动到的目标元素 targetEl 目标元素， 0 动画时间
    scroll.scrollToElement(targetEl, 0)
  }

  return {
    shortcutList,
    scrollRef,
    onShortcutTouchStart,
    onShortcutTouchMove
  }
}
