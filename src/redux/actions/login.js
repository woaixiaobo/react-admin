import {
  reqLogin,
  reqLogout
} from "@api/acl/login";
import {
  reqMobileLogin
} from "@api/acl/oauth";

import {
  LOGIN_SUCCESS,
  REMOVE_TOKEN
} from "../constants/login";

// 手机号密码登录
export const mobileLogin = (mobile, code) => {
  return (dispatch) => {
    // 执行异步代码~
    return reqMobileLogin(mobile, code).then(({
      token
    }) => {
      dispatch(loginSync(token));
      return token;
    });
  };
};

//登录账号
export const loginSync = token => ({
  type: LOGIN_SUCCESS,
  data: token,
})
export const login = (username, password) => {
  return (dispatch) => {
    //执行异步代码，发送请求，
    return reqLogin(username, password).then(({
      token
    }) => {
      dispatch(loginSync(token));
      return token;
    })
  }
}

//登出账号
export const removeToken = () => ({
  type: REMOVE_TOKEN,
})

export const logout = () => {
  return (dispatch) => {
    return reqLogout().then(() => {
      dispatch(removeToken)
    })
  }
}