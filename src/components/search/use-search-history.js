import { remove, save, clear } from '@/assets/js/array-store'
import { SEARCH_KEY } from '@/assets/js/constant'
import { useStore } from 'vuex'

// 搜索历史的保存与删除相关逻辑
export default function useSearchHistory() {
  const store = useStore()
  // 最大存储长度
  const maxLen = 200

  // 搜索历史保存方法
  function saveSearch(query) {
    // 存储到本地 query 输入的关键字 key 搜索历史的标识id
    const searches = save(query, SEARCH_KEY, (item) => {
      return item === query
    }, maxLen)
    // 提交搜索历史数组searches到searchHistory
    store.commit('setSearchHistory', searches)
  }

  // 删除某个搜索历史关键字的方法
  function deleteSearch(query) {
    // 调用remove方法从本地存储中删除
    const searches = remove(SEARCH_KEY, (item) => {
      return item === query
    })
    // 重新提交搜索历史数组searches到searchHistory
    store.commit('setSearchHistory', searches)
  }

  // 删除全部搜索历史
  function clearSearch() {
    const searches = clear(SEARCH_KEY)
    store.commit('setSearchHistory', searches)
  }

  return {
    saveSearch,
    deleteSearch,
    clearSearch
  }
}
