<template>
  <div class="singer" v-loading="!singers.length">
    <index-list
      :data="singers"
    ></index-list>
  </div>
</template>

<script>
  import { getSingerList } from '@/service/singer'
  import IndexList from '@/components/base/index-list/index-list'

  export default {
  name: 'singer',
  components: {
    IndexList
  },
  data() {
    return {
      singers: []
    }
  },
  // created生命周期：在模板渲染成html前调用，即通常初始化某些属性值，然后再渲染成视图
  async created() {
    const result = await getSingerList()
    this.singers = result.singers
    console.log(result)
  }
}
</script>

<style lang="scss" scoped>
.singer {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
}
</style>
