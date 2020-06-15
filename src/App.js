import React ,{useEffect,useState}from "react";
import {
  Router
} from "react-router-dom";
import history from "@utils/history";
import PubSub from "pubsub-js";

import Layout from "./layouts";
// 引入重置样式（antd已经重置了一部分了）
import "./assets/css/reset.css";
//引入国际化,接受一个语言,并向组组件提供环境
import {
  IntlProvider
} from "react-intl"
//引入语言包
import {
  zh,
  en
} from "./locales"

function App() {
  const [locale,setLocale] = useState("en");
  const [message,setMessage] = useState(locale === "en" ? en : zh);

  useEffect(()=>{
    //订阅信息
		PubSub.subscribe("SELECTED_KEYS", (msg, data) => {
      setLocale(data)
      setMessage(data[0] === "en" ? en : zh)
      // console.log(data);
      
		});
  },[])
  // console.log(message);
  
  // const message = locale === "en" ? en : zh;
  return ( <Router history = {
      history
    } >
    <
    IntlProvider locale = {
      locale
    }
    messages = {
      message
    } >
    <
    Layout / >
    </IntlProvider> </Router >
  );
}

export default App;