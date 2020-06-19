import {
  GET_USER_INFO,
  GET_MENU
} from "./constants";

const initUser = {
  name: "", //用户名字
  avatar: "", //头像
  permissionValueList: [], // 按钮权限列表

  permissionList: [], // 路由权限列表
}
export default function user(prevState = initUser, action) {
  switch (action.type) {
    case GET_USER_INFO:
      return {
        ...prevState,
        ...action.data,
      };
    case GET_MENU:
      return {
        ...prevState,
        permissionList: action.data
      };
    default:
      return prevState;
  }
}