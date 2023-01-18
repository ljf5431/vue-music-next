// 收藏相关的逻辑代码

import { useStore } from 'vuex'
import { computed } from 'vue'
import { save, remove } from '@/assets/js/array-store'
import { FAVORITE_KEY } from '@/assets/js/constant'

// 播放器收藏和取消歌曲以及样式的同步修改
export default function useFavorite() {
  // 暂存vuex中的数据
  const store = useStore()
  // 获取收藏列表
  const favoriteList = computed(() => store.state.favoriteList)
  // 设置收藏的最大存储长度
  const maxLen = 100

  // 根据收藏列表内有无当前歌曲数据修改样式
  function getFavoriteIcon(song) {
    return isFavorite(song) ? 'icon-favorite' : 'icon-not-favorite'
  }

  // 点击添加或移除收藏
  function toggleFavorite(song) {
    let list
    if (isFavorite(song)) {
      // 移除收藏
      list = remove(FAVORITE_KEY, compare)
    } else {
      // 添加收藏 item 歌曲 key歌曲的标识id compare查询规则
      list = save(song, FAVORITE_KEY, compare, maxLen)
    }
    // 重新提交收藏列表
    store.commit('setFavoriteList', list)

    // 收藏的查询规则
    function compare(item) {
      // 用歌曲id判断是否为同一首歌
      return item.id === song.id
    }
  }

  // 在收藏列表中查询有无歌曲
  function isFavorite(song) {
    return favoriteList.value.findIndex((item) => {
      // 在收藏列表内查找到了
      return item.id === song.id
      // 没有符合条件的元素返回 -1
    }) > -1
  }

  return {
    getFavoriteIcon,
    toggleFavorite
  }
}
