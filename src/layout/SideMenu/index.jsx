import React, { Component } from "react";
import { Menu } from "antd";
import { connect } from "react-redux";
import icons from "@conf/icons";
import { defaultRoutes } from "@conf/routes";
import { Link, withRouter } from "react-router-dom";
const { SubMenu } = Menu;
@withRouter
@connect((state) => ({
	permissionList: state.user.permissionList,
}))
class SideMenu extends Component {
	//需要显示的左侧菜单的路由
	renderMenu = (menuList, parentPath = "") => {
		return menuList.map((menu) => {
			//取出需要的数据
			const { children, icon, path, name, hidden } = menu;
			//过滤不需要的菜单显示（按钮这类的）
			if (hidden) return null;
			//获取图标组件
			const Icon = icons[icon];
			//有二级菜单的话
			if (children && children.length) {
				return (
					<SubMenu key={path} icon={<Icon />} title={name}>
						{/* {children.map((cMenu) => {
							if (cMenu.hidden) return null;
							return <Menu.Item key={cMenu.path}>{cMenu.name}</Menu.Item>;
						})} */}
						{/* 利用递归 全部变为一次菜单然后再叠加 */}
						{this.renderMenu(children, path)}
					</SubMenu>
				);
			} else {
				//一级菜单
				const currentPath = parentPath + path; //父级菜单路径 + 子菜单路径
				return (
					<Menu.Item key={currentPath} icon={Icon ? <Icon /> : null}>
						<Link to={currentPath}>{name}</Link>
					</Menu.Item>
				);
			}
		});
	};
	//展开菜单的key，返回的必须是数组
	getOpenKeys = (pathname) => {
		if (pathname === "/") return [];
		//展开一级菜单
		return ["/" + pathname.split("/")[1]];
	};
	render() {
		const {
			permissionList,
			location: { pathname },
		} = this.props;
		return (
			<Menu
				theme="dark"
				mode="inline"
				defaultSelectedKeys={[pathname]}
				defaultOpenKeys={this.getOpenKeys(pathname)}
			>
				{/* 默认只要登录就可以访问的私有路由 */}
				{this.renderMenu(defaultRoutes)}
				{/* 通过后台数据动态生成的私有路由 */}
				{this.renderMenu(permissionList)}
			</Menu>
		);
	}
}

export default SideMenu;
