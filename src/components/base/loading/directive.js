// 创建自定义指令

import Loading from './loading'
import createLoadingLikeDirective from '@/assets/js/create-loading-like-directive'
// 调用createLoadingLikeDirective方法并传入组件，创建自定义指令
const loadingDirective = createLoadingLikeDirective(Loading)

export default loadingDirective
