<!--搜索框组件-->

<template>
  <div class="search-input">
    <i class="icon-search"></i>
    <input
      class="input-inner"
      v-model="query"
      :placeholder="placeholder"
    />
    <i
      v-show="query"
      class="icon-dismiss"
      @click="clear"
    ></i>
  </div>
</template>

<script>
import { debounce } from 'throttle-debounce'

export default {
  name: 'search-input',
  // 接收用户输入的字符串
  props: {
    modelValue: String,
    // 搜索框默认显示文字
    placeholder: {
      type: String,
      default: '搜索歌曲、歌手'
    }
  },
  data() {
    return {
      query: this.modelValue
    }
  },
  // created:在模板渲染成html前调用，即通常初始化某些属性值，然后再渲染成视图
  created () {
    // 监听用户输入时字符串变化
    this.$watch('query', debounce(300, (newQuery) => {
      this.$emit('update:modelValue', newQuery.trim())
    }))
    // 监听外部修改输入框的内容
    this.$watch('modelValue', (newVal) => {
      this.query = newVal
    })
  },
  methods: {
    clear() {
      this.query = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.search-input {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  padding: 0 6px;
  height: 32px;
  background: $color-highlight-background;
  border-radius: 6px;
  .icon-search {
    font-size: 24px;
    color: $color-text-d;
  }
  .input-inner {
    flex: 1;
    margin: 0 5px;
    line-height: 18px;
    background: $color-highlight-background;
    color: $color-text;
    font-size: $font-size-medium;
    outline: 0;
    &::placeholder {
      color: $color-text-d;
    }
  }
  .icon-dismiss {
    font-size: 16px;
    color: $color-text-d;
  }
}
</style>
