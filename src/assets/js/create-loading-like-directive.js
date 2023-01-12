// 自定义指令

import { createApp } from 'vue'
import { addClass, removeClass } from '@/assets/js/dom'

const relativeCls = 'g-relative'// 动态添加样式
// 定义一个方法 传入组件创建自定义指令
export default function createLoadingLikeDirective(Comp) {
  return {
    mounted(el, binding) {
      // 创建一个新的实例对象
      const app = createApp(Comp)
      // document.createElement()是在对象中创建一个对象
      const instance = app.mount(document.createElement('div'))
      // 获取传入组件的名称 避免后续覆盖问题
      const name = Comp.name
      if (!el[name]) {
        el[name] = {}
      }
      // 作用在哪个页面的DOM，el就指向哪个页面的DOM
      el[name].instance = instance // 保留instance，方便下次使用 instance为传入组件的实例对象
      // 动态修改传入组件的title参数
      const title = binding.arg
      if (typeof title !== 'undefined') {
        // 调用传入组件的setTitle方法
        instance.setTitle(title)
      }
      if (binding.value) {
        append(el)
      }
    },
    updated(el, binding) {
      // 获取传入组件的名称 避免后续覆盖问题
      const name = Comp.name
      // 动态修改传入组件的title参数
      const title = binding.arg
      if (typeof title !== 'undefined') {
        // 调用传入组件的setTitle方法
        el[name].instance.setTitle(title)
      }
      // 判断binding.value的值有没有发送变化
      if (binding.value !== binding.oldValue) {
        binding.value ? append(el) : remove(el)
      }
    }
  }

  function append(el) {
    const style = getComputedStyle(el)
    // 获取传入组件的名称 避免后续覆盖问题
    const name = Comp.name
    // 1.先判断页面主体的布局方式
    if (['absolute', 'fixed', 'relative'].indexOf(style.position) === -1) {
      // 没有就添加上这个样式名
      addClass(el, relativeCls)
    }
    el.appendChild(el[name].instance.$el)
  }

  function remove(el) {
    // 获取传入组件的名称 避免后续覆盖问题
    const name = Comp.name
    // 2.组件过后 移除这个样式
    removeClass(el, relativeCls)
    el.removeChild(el[name].instance.$el)
  }
}
