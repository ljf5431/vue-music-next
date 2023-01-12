// loading组件逻辑

export function addClass(el, className) {
  // 利用contains来判断是否包含这个样式名
  if (!el.classList.contains(className)) {
    // 没有的话就添加上
    el.classList.add(className)
  }
}

export function removeClass(el, className) {
  // 利用remove来移除这个样式名
  el.classList.remove(className)
}
