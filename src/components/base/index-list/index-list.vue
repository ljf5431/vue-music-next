<template>
  <scroll
    class="index-list"
    :probe-type="3"
    @scroll="onScroll"
  >
    <!--整个列表-->
    <ul ref="groupRef">
      <!--每个字母算一个列表-->
      <li
        v-for="group in data"
        :key="group.title"
        class="group"
      >
        <!--字母作为标题-->
        <h2 class="title">{{group.title}}</h2>
        <!--字母列表包含的歌手-->
        <ul>
          <li
            v-for="item in group.list"
            :key="item.id"
            class="item"
          >
            <img class="avatar" v-lazy="item.pic">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <!--标题吸顶效果-->
    <div
      class="fixed"
      v-show="fixedTitle"
      :style="fixedStyle"
    >
      <div class="fixed-title">{{fixedTitle}}</div>
    </div>
  </scroll>
</template>

<script>
import Scroll from '@/components/scroll/scroll'
import useFixed from './use-fixed'

export default {
  name: 'index-list',
  components: { Scroll },
  // props 接收页面传递的数据
  props: {
    data: {
      type: Array,
      default () {
        return []
      }
    }
  },
  setup(props) {
    // groupRef对应整个列表的DOM
    const { groupRef, onScroll, fixedTitle, fixedStyle } = useFixed(props)
    // 返回到use-fixed模板上
    return {
      groupRef,
      onScroll,
      fixedTitle,
      fixedStyle
    }
  }
}
</script>

<style lang="scss" scoped>
.index-list {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: $color-background;
  .group {
    padding-bottom: 30px;
    .title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
      background: $color-highlight-background;
    }
    .item {
      display: flex;
      align-items: center;
      padding: 20px 0 0 30px;
      .avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }
      .name {
        margin-left: 20px;
        color: $color-text-l;
        font-size: $font-size-medium;
      }
    }
  }
  .fixed {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    .fixed-title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
      background: $color-highlight-background;
    }
  }
}
</style>
