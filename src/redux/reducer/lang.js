import {
  CHANGE_LANGUAGE
} from "../constants/lang";

//初始化从浏览器当中加载默认的语言环境
const initLang = window.navigator.language === "en" ? "en" : "zh";

export default function language(prevState = initLang, action) {
  switch (action.type) {
    case CHANGE_LANGUAGE:
      return action.data;
    default:
      return prevState;
  }
}