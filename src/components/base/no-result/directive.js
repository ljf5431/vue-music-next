// 创建自定义指令

import NoResult from './no-result'
import createLoadingLikeDirective from '@/assets/js/create-loading-like-directive'
// 调用createLoadingLikeDirective方法并传入组件，创建自定义指令
const noResultDirective = createLoadingLikeDirective(NoResult)

export default noResultDirective
