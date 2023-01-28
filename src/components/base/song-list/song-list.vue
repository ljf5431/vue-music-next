<!--歌曲列表组件-->
<template>
  <ul class="song-list">
    <li
      class="item"
      v-for="(song, index) in songs"
      :key="song.id"
      @click="selectItem(song, index)"
    >
      <div class="rank" v-if="rank">
        <span :class="getRankCls(index)">{{ getRankText(index) }}</span>
      </div>
      <div class="content">
        <!--歌手名-->
        <h2 class="name">{{song.name}}</h2>
        <!--专辑名-->
        <p class="desc">{{getDesc(song)}}</p>
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'song-list',
  props: {
    songs: {
      type: Array,
      default () {
        return []
      }
    },
    rank: Boolean
  },
  // 管理自定义事件 参数为自定义事件名
  emits: ['select'],
  methods: {
    // 拼接歌手名-专辑名
    getDesc(song) {
      return `${song.singer}.${song.album}`
    },
    // 点击发出自定义事件-select附带歌曲参数
    selectItem(song, index) {
      this.$emit('select', { song, index })
    },
    // 榜单详情页前三首的样式
    getRankCls(index) {
      if (index <= 2) {
        return `icon icon${index}`
      } else {
        return 'text'
      }
    },
    // 榜单详情页歌曲的序号
    getRankText(index) {
      if (index > 2) {
        return index + 1
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.song-list {
  .item {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 64px;
    font-size: $font-size-medium;
    .rank {
      flex: 0 0 25px;
      width: 25px;
      margin-right: 20px;
      text-align: center;
      .icon {
        display: inline-block;
        width: 25px;
        height: 24px;
        background-size: 25px 24px;
        &.icon0 {
          @include bg-image('first');
        }
        &.icon1 {
          @include bg-image('second');
        }
        &.icon2 {
          @include bg-image('third');
        }
      }
      .text {
        color: $color-theme;
        font-size: $font-size-large;
      }
    }
    .content {
      flex: 1;
      line-height: 20px;
      overflow: hidden;
      .name {
        @include no-wrap;
        color: $color-text;
      }
      .desc {
        @include no-wrap;
        margin-top: 4px;
        color: $color-text-d;
      }
    }
  }
}
</style>
