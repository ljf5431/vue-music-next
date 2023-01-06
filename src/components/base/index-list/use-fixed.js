// 获取固定吸顶标题的内容
import { ref, watch, nextTick, computed } from 'vue'

export default function useFixed(props) {
  // groupRef对应整个列表的DOM
  const groupRef = ref(null)
  // TITLE_HEIGHT为列表标题自身的高度
  const TITLE_HEIGHT = 30
  // listHeights 动态记录字母标题的高度
  const listHeights = ref([])
  // scrollY 接收纵轴滚动的信息
  const scrollY = ref(0)
  // currentIndex 表示当前列表的索引值
  const currentIndex = ref(0)
  // fixedTitle 得到当前列表的标题
  const fixedTitle = computed(() => {
    if (scrollY.value < 0) {
      return ''
    }
    const currentGroup = props.data[currentIndex.value]
    // 有这个索引值就显示字母标题 没有就为空
    return currentGroup ? currentGroup.title : ''
  })
  // distance 表示当前列表的下一列表距离顶部的距离
  const distance = ref(0)
  // fixedStyle 判断是否添加标题上移效果
  const fixedStyle = computed(() => {
    const distanceVal = distance.value
    // diff 标题栏需要上移的高度
    const diff = (distanceVal > 0 && distanceVal < TITLE_HEIGHT) ? distanceVal - TITLE_HEIGHT : 0
    return {
      transform: `translate3d(0, ${diff}px, 0)`
    }
  })

  // watch 用于侦听数据的变化
  watch(() => props.data, async () => {
    // nextTick DOM更新循环结束之后执行延迟回调。在修改数据之后，获取更新后的DOM
    await nextTick()
    // 数据发生变化后获取高度
    calculate()
  })

  // 监听scrollY的变化相当于监听滚动
  watch(scrollY, (newY) => {
    const listHeightsVal = listHeights.value
    // listHeightsVal.length-1因为添加了一个 0 进去
    for (let i = 0; i < listHeightsVal.length - 1; i++) {
      const heightTop = listHeightsVal[i]
      const heightBottom = listHeightsVal[i + 1]
      // 判断是否在某个字母列表区间内
      if (newY >= heightTop && newY <= heightBottom) {
        // 得到当前列表的索引
        currentIndex.value = i
        // 当前列表的底部就是下一列表的顶部
        distance.value = heightBottom - newY
      }
    }
  })

  // 求列表的高度
  function calculate() {
    const list = groupRef.value.children
    const listHeightsVal = listHeights.value

    // 初始化列表的高度
    listHeightsVal.length = 0
    // 记录列表区间的高度
    let height = 0
    // 把第一个高度0 添加到listHeights里面
    listHeightsVal.push(height)

    // 遍历字母列表
    for (let i = 0; i < list.length; i++) {
      // 累加列表高度
      height += list[i].clientHeight
      // 添加到listHeights里面
      listHeightsVal.push(height)
    }
  }

  function onScroll(pos) {
    scrollY.value = -pos.y
  }

  return {
    groupRef,
    onScroll,
    fixedTitle,
    fixedStyle,
    currentIndex
  }
}
