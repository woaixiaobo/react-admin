import React, { Component } from "react";
import PrimaryLayout from "../../layout/PrimaryLayout";
import { connect } from "react-redux";
import { getMenus, getUserinfo } from "./redux";
@connect(null, { getMenus, getUserinfo })
class Authorized extends Component {
	state = {
		isLoading: true,
	};
	//请求数据
	componentDidMount() {
		const { getMenus, getUserinfo } = this.props;
		const promises = [getMenus(), getUserinfo()];
		//发送请求
		Promise.all(promises).then(() => {
			//数据全部请求回来,loading取消
			this.setState({
				isLoading: false,
			});
		});
	}
	render() {
		const { isLoading } = this.state;
		return isLoading ? <div>Loading...</div> : this.props.children;
	}
}

export default Authorized;
