// localStorage 长期缓存（无截至日期）
// sessionStorage 短期缓存（关闭浏览器清除）// 第三方缓存库
import storage from 'good-storage' // localStorage 长期缓存（无截至日期）

// 插入到缓存数据中 arr页面现有的元素 val-数据的标识 compare-查询规则
function inertArray(arr, val, compare, maxLen) {
  // 暂存当前歌曲的id
  const index = arr.findIndex(compare)
  // 大于-1说明存在于数据列表中
  if (index > -1) {
    return
  }
  // 插入到缓存数据的最前面
  arr.unshift(val)
  // 传了maxLen最大长度时判断
  if (maxLen && arr.length > maxLen) {
    // 超过了最大长度时把最早存储的数据移除
    arr.pop()
  }
}

// 从缓存里删除数据 (arr-数据的标识 compare-查询规则)
function deleteFromArray(arr, compare) {
  // 暂存当前歌曲的id
  const index = arr.findIndex(compare)
  // 大于-1说明存在于数据列表中
  if (index > -1) {
    // 删除这条数据
    arr.splice(index, 1)
  }
}

// 保存数据 (item-数据 key-数据的标识 compare-查询规则 maxLen-存储的最大长度)
export function save(item, key, compare, maxLen) {
  // 获取页面现有的元素
  const items = storage.get(key, [])
  // 插入到数组中
  inertArray(items, item, compare, maxLen)
  // 插入到缓存数据中
  storage.set(key, items)
  return items
}

// 从缓存里删除数据 (key-数据的标识 compare-查询规则)
export function remove(key, compare) {
  // 获取页面现有的元素
  const items = storage.get(key, [])
  deleteFromArray(items, compare)
  // 从缓存数据里删除
  storage.set(key, items)
  return items
}

// vuex读取本地缓存
export function load(key) {
  return storage.get(key, [])
}

// 清空某一个key下的本地存储数据
export function clear(key) {
  storage.remove(key)
  return []
}
