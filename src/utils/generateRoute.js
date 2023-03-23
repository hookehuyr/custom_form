/*
 * @Date: 2022-05-16 17:21:45
 * @LastEditors: hookehuyr hookehuyr@gmail.com
 * @LastEditTime: 2022-06-29 17:00:15
 * @FilePath: /tswj/src/utils/generateRoute.js
 * @Description: 文件描述
 */

/**
 * 根据后台返回的路径，生成页面的组件模版
 * @param {*} component 
 * @returns 模版地址
 */
function loadView(component) {
  return () => import(`../views/${component}.vue`)
}

/**
 * 生成路由结构
 * @param {*} routes
 */
const generateRoutes = (routes) => {
  const arr = []
  routes.forEach(route => {
    const router = {}
    const {
      path,
      redirect,
      name,
      component,
      keepAlive,
      meta,
      children
    } = route

    router.path = path
    redirect && (router.redirect = redirect)
    name && (router.name = name)
    router.component = loadView(component)
    keepAlive && (router.keepAlive = keepAlive)
    meta && (router.meta = meta)
    router.children = !Array.isArray(children) || generateRoutes(children);
    arr.push(router)
  })
  return arr
}

export default generateRoutes;
