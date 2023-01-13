// 工具函数

// 洗牌函数：打乱原始歌曲列表，生成一个新的列表 source原始歌曲列表
export function shuffle(source) {
  // 暂存原数组，避免影响原数组 slice()从已有的数组中返回选定的元素
  const arr = source.slice()
  for (let i = 0; i < arr.length; i++) {
    const j = getRandomInt(i)
    swap(arr, i, j)
  }
  // 返回新生成的随机数组
  return arr
}
// 生成一个随机的整数值
function getRandomInt(max) {
  // Math.random()是令系统随机选取大于等于 0.0 且小于 1.0 的伪随机 double 值
  // >= 0且< max 这样的话就获取不到max本身 所以要 +1 用floor()取整
  return Math.floor(Math.random() * (max + 1))
}
// 把随机数跟原来的索引进行交换
function swap(arr, i, j) {
  // 把i赋值给临时变量
  const t = arr[i]
  // 在把j赋值给i
  arr[i] = arr[j]
  // 把临时变量赋值给j
  arr[j] = t
}
// *********************************
// 毫秒数转换分钟
export function formatTime(interval) {
  // interval当前毫秒数 向下取整
  interval = interval | 0
  // 毫秒数除60并向下取整 padStart在头部补充0保持两位数
  const minute = ((interval / 60 | 0) + '').padStart(2, '0')
  const second = (interval % 60 + '').padStart(2, '0')
  // 返回 分钟:秒 格式的时间数据
  return `${minute}:${second}`
}
