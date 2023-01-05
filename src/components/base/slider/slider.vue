<!--轮播图组件-->
<template>
  <div class="slider" ref="rootRef">
    <div class="slider-group">
      <div
        class="slider-page"
        v-for="item in sliders"
        :key="item.id"
      >
        <a :href="item.link">
          <img :src="item.pic">
        </a>
      </div>
    </div>
    <!-- 轮播图的指示点 -->
    <div class="dots-wrapper">
      <span
        class="dot"
        v-for="(item, index) in sliders"
        :key="item.id"
        :class="{'active': currentPageIndex === index}">
      </span>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import useSlider from './use-slider'

export default {
  name: 'slider',
  // 接收页面传递的数据
  props: {
    sliders: {
      type: Array,
      default() {
        return []
      }
    }
  },
  // setup生命周期：组件创建时运行
  setup() {
    const rootRef = ref(null)
    const { currentPageIndex } = useSlider(rootRef)

    return {
      rootRef,
      currentPageIndex
    }
  }
}
</script>

<style lang="scss" scoped>
  .slider {
    // min-height 能够设置元素的最小高度,防止 height 属性的应用值小于 min-height 的值
    min-height: 1px;
    font-size: 0;
    //touch-action用于设置触摸屏用户如何操纵元素的区域
    touch-action: pan-y;//启用单指垂直平移手势
    .slider-group {
      position: relative;
      overflow: hidden;// 溢出内容被裁剪
      white-space: nowrap;
      .slider-page {
        display: inline-block;// 转换为行内块元素
        transform: translate3d(0, 0, 0);// 函数在 3D 空间内移动一个元素的位置
        backface-visibility: hidden;// 3D情况下指定当元素背面朝向观察者时是否可见
        a {
          display: block;
          width: 100%;
        }
        img {
          display: block;
          width: 100%;
        }
      }
    }
    // 指示点样式
    .dots-wrapper {
      position: absolute;
      left: 50%;
      bottom: 12px;
      line-height: 12px;
      transform: translateX(-50%);
      .dot {
        display: inline-block;
        margin: 0 4px;
        width: 8px;
        height: 8px;
        border-radius: 50px;
        background: $color-text-l;
        &.active {
          width: 20px;
          border-radius: 5px;
          background: $color-text-ll;
        }
      }
    }
  }
</style>
