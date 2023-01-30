<template>
  <m-header></m-header>
  <tab></tab>
<!--router-view：承载对应的路由视图-组件的内容-->
  <router-view :style="viewStyle"></router-view>
  <!--给路由组件切换添加过渡动画-->
  <router-view
    :style="viewStyle"
    name="user"
    v-slot="{ Component }"
  >
    <transition appear name="slide">
      <component :is="Component"/>
    </transition>
  </router-view>
  <player></player>
</template>

<script>
import Header from '@/components/header/header'
import Tab from '@/components/tab/tab'
import Player from '@/components/player/player'
import { mapState } from 'vuex'

export default {
  components: {
    Player,
    MHeader: Header,
    Tab
  },
  computed: {
    viewStyle() {
      const bottom = this.playlist.length ? '60px' : '0'
      return {
        bottom
      }
    },
    ...mapState([
      'playlist'
    ])
  }
}
</script>

<style lang="scss">

</style>
