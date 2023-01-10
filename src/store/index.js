import { createStore, createLogger } from 'vuex'
import state from './state'
import mutations from './mutations'
// * as 表示生成一个对象 包含全部变量
import * as getters from './getters'
import * as actions from './actions'

const debug = process.env.NODE_ENV !== 'production'

export default createStore({
  // state记录全局数据 相当于全局数据仓库
  state,
  // getters相当于state的计算属性
  getters,
  // 提交更新数据的方法,必须是同步的(如果需要异步使用action)
  mutations,
  // 类似mutations 执行异步方法
  actions,

  // 严格模式下，只要状态变更不是通过mutation产生的，就会抛出错误
  strict: debug,
  // 开发环境下使用 createLogger内置日志查看函数
  plugins: debug ? [createLogger()] : [],

  // 模块化vuex,可以让每一个模块拥有自己的state、mutation、action、getters,使得结构非常清晰,管理更为方便
  modules: {
  }
})
