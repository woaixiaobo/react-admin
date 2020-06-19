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
import SideMenu from "../SideMenu";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { defaultRoutes } from "@conf/routes";
import AuthorizedRouter from "@comps/Authorized/AuthorizedRouter";

import "./index.less";
const { Header, Sider, Content, Footer } = Layout;
@withRouter
@connect((state) => ({ user: state.user }))
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
	//获取当前路由配置
	getCurrentRoute = (permissionList, pathname) => {
		for (let i = 0; i < permissionList.length; i++) {
			//收集一级菜单
			const route = permissionList[i];
			//找到点击的对应的一级菜单
			if (route.path === pathname) {
				return {
					...route,
					children: undefined, //通过children来区分是一级菜单还是二级菜单
				};
			}
			const { children } = route;
			//找二级菜单
			if (children && children.length) {
				for (let j = 0; j < children.length; j++) {
					//二级菜单
					const item = children[j];
					//拼成二级完成的菜单路径（父级菜单+子级菜单路径）
					const currentPath = route.path + item.path;
					if (currentPath === pathname) {
						return {
							//一级菜单
							...route,
							//二级菜单
							children: item,
						};
					}
				}
			}
		}
	};
	render() {
		const {
			user,
			location: { pathname },
		} = this.props;
		//先找私有的静态路由
		let currentRoute = this.getCurrentRoute(defaultRoutes, pathname);
		//没有再找动态的
		if (!currentRoute) {
			currentRoute = this.getCurrentRoute(user.permissionList, pathname);
		}
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
					<SideMenu />
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
							{/* 如果是二级菜单，不要面包导航 */}
							{currentRoute.children && (
								<Breadcrumb>
									{/* 一级菜单名称 */}
									<Breadcrumb.Item>{currentRoute.name}</Breadcrumb.Item>
									{/* 二级菜单名称 */}
									<Breadcrumb.Item>
										{currentRoute.children.name}
									</Breadcrumb.Item>
								</Breadcrumb>
							)}
							<h3>
								{currentRoute.children
									? currentRoute.children.name
									: currentRoute.name}
							</h3>
						</div>
						{/* 右侧内容区显示动态路由组件 */}
						<div className="layout-content">
							<AuthorizedRouter permissionList={user.permissionList} />
						</div>
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
