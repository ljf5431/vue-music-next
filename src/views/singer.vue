<template>
  <div class="recommend">
    歌手页面
  </div>
</template>

<script>
  import { getSingerList } from '@/service/singer'

  export default {
  name: 'singer',
  // created生命周期：在模板渲染成html前调用，即通常初始化某些属性值，然后再渲染成视图
  async created() {
    const result = await getSingerList()
    console.log(result)
  }
}
</script>

<style scoped>

</style>
