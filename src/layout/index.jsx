import React, { Component } from "react";
import { connect } from "react-redux";
import PrimaryLayout from "./PrimaryLayout";
import PublicLayout from "./PublicLayout";
@connect((state) => ({ token: state.token }))
class Layout extends Component {
	render() {
		//根据是否登录来决定 是共有页面还是私有
		const { token } = this.props;
		return token ? <PrimaryLayout /> : <PublicLayout />;
	}
}

export default Layout;
