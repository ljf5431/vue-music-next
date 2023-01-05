import { createApp } from 'vue'
import Loading from './loading'
import { addClass, removeClass } from '@/assets/js/dom'

const relativeCls = 'g-relative'// 动态添加样式

const loadingDirective = {
  mounted(el, binding) {
    // 创建一个新的实例对象
    const app = createApp(Loading)
    const instance = app.mount(document.createElement('div'))
    // 作用在哪个页面的DOM，el就指向哪个页面的DOM
    el.instance = instance // 保留instance，方便下次使用 instance为Loading组件的实例对象
    // 动态修改loading组件的title参数
    const title = binding.arg
    if (typeof title !== 'undefined') {
      // 调用loading组件的setTitle方法
      instance.setTitle(title)
    }
    if (binding.value) {
      append(el)
    }
  },
  updated(el, binding) {
    // 动态修改loading组件的title参数
    const title = binding.arg
    if (typeof title !== 'undefined') {
      // 调用loading组件的setTitle方法
      el.instance.setTitle(title)
    }
    // 判断binding.value的值有没有发送变化
    if (binding.value !== binding.oldValue) {
      binding.value ? append(el) : remove(el)
    }
  }
}

function append(el) {
  // debugger
  const style = getComputedStyle(el)
  // 1.先判断页面主体的布局方式
  if (['absolute', 'fixed', 'relative'].indexOf(style.position) === -1) {
    // 没有就添加上这个样式名
    addClass(el, relativeCls)
  }
  el.appendChild(el.instance.$el)
}

function remove(el) {
  // 2.loading组件过后 移除这个样式
  removeClass(el, relativeCls)
  el.removeChild(el.instance.$el)
}

export default loadingDirective
