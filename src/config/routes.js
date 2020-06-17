//路由配置文件

//引入懒加载
import {
  lazy
} from "react"

//使用懒加载,首页
/* 
    默认打包的模块名称使用id命名，id从0开始递增 
    webpackChunkName: "login" 给打包的模块取个名字
  */
const Login = lazy(() => import( /* webpackChunkName: "login" */ "@pages/Login"))
const Oauth = lazy(() => import( /* webpackChunkName: "oauth" */ "@pages/Login/components/Oauth"))
const NotFound = lazy(() => import( /* webpackChunkName: "404" */ "@pages/404"))

//公开路由表,谁都可以访问的地址
const constantRoutes = [{
    title: "登录",
    path: "/login",
    component: Login
  },
  {
    title: "授权登录",
    path: "/oauth",
    component: Oauth,
  },
  {
    title: "404",
    path: "*",
    component: NotFound,
  },
]
//私有路由表,只要登录了就能访问首页
const defaultRoute = [{
  title: "首页",
  path: "/",
  component: "Admin",
}]
export {
  constantRoutes,
  defaultRoute
}