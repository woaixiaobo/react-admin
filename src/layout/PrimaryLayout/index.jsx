import React, { Component } from "react";
import { Layout, Menu, Breadcrumb } from "antd";
import {
	MenuUnfoldOutlined,
	MenuFoldOutlined,
	UserOutlined,
	VideoCameraOutlined,
	UploadOutlined,
	GlobalOutlined,
} from "@ant-design/icons";
import logo from "@assets/images/logo.png";

import "./index.less";
const { Header, Sider, Content, Footer } = Layout;

class index extends Component {
	state = {
		collapsed: false,
	};
	toggle = () => {
		this.setState({
			collapsed: !this.state.collapsed,
		});
	};
	onCollapse = (collapsed) => {
		this.setState({ collapsed });
	};
	render() {
		return (
			<Layout className="layout">
				{/* 左侧导航 */}
				<Sider
					collapsible
					collapsed={this.state.collapsed} // 收缩/展开侧边栏的方法
					onCollapse={this.onCollapse}
				>
					<div className="layout-logo">
						<img src={logo} alt="logo" />
						{!this.state.collapsed && <h1>硅谷教育管理系统</h1>}
					</div>
					<Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
						<Menu.Item key="1" icon={<UserOutlined />}>
							nav 1
						</Menu.Item>
						<Menu.Item key="2" icon={<VideoCameraOutlined />}>
							nav 2
						</Menu.Item>
						<Menu.Item key="3" icon={<UploadOutlined />}>
							nav 3
						</Menu.Item>
					</Menu>
				</Sider>
				{/* 右侧布局 */}
				<Layout className="site-layout">
					{/* 右侧头部 */}
					<Header className="layout-header">
						{/* 左侧点击收缩按钮 */}
						{React.createElement(
							this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
							{
								className: "trigger",
								onClick: this.toggle,
							}
						)}
						{/* 登录标志 */}
						<div>
							<img src={logo} alt="avatar" />
							<span>admin</span>
							<GlobalOutlined />
						</div>
					</Header>
					{/* 右侧内容区 */}
					<Content>
						<div className="layout-nav">
							<Breadcrumb>
								<Breadcrumb.Item>User</Breadcrumb.Item>
								<Breadcrumb.Item>Bill</Breadcrumb.Item>
							</Breadcrumb>
							<h3>User</h3>
						</div>
						<div className="layout-content">Bill is a cat.</div>
					</Content>
					{/* 右边底部 */}
					<Footer className="layout-footer">
						©2020课程版权均归硅谷教育管理系统所有
					</Footer>
				</Layout>
			</Layout>
		);
	}
}

export default index;
