import React, { Component } from "react";
import { BrowserRouter } from "react-router-dom";
import Layout from "./layout";
// 引入公共样式
import "./assets/css/reset.css";
import "./assets/css/common.less";
class App extends Component {
	render() {
		return (
			<BrowserRouter>
				<Layout />
			</BrowserRouter>
		);
	}
}

export default App;
