<template>
  <m-header></m-header>
  <tab></tab>
<!--router-view：承载对应的路由视图-组件的内容-->
  <router-view></router-view>
</template>

<script>
import Header from '@/components/header/header'
import Tab from '@/components/tab/tab'

export default {
  components: {
    MHeader: Header,
    Tab
  }
}
</script>

<style lang="scss">

</style>
