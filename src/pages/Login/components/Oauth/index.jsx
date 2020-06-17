import React, { Component } from "react";
import { connect } from "react-redux";
import { loginSync } from "@redux/actions/login";
@connect(null, { loginSync })
class Oauth extends Component {
	componentDidMount() {
		//获取存在query当中的token参数,用来进行等六
		const token = this.props.location.search.split("=")[1];
		//保存在redux当中
		this.props.loginSync(token);
		console.log(token);

		//保存到本地
		localStorage.setItem("user_token", token);
		//跳转到首页
		this.props.history.replace("/");
	}
	render() {
		return <div>Oauth...</div>;
	}
}

export default Oauth;
