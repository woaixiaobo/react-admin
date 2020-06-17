import React from "react"
import ReactDom from "react-dom"
import {Provider} from "react-redux"

import App from "./App"
import store from "./redux/store"

ReactDom.render(
  //利用react-redux通信来给子组件传递store对象
  <Provider store={store}>
    <App/>
  </Provider>,
  document.getElementById("root")
)