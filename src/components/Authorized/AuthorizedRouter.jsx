import React, { Component, Suspense } from "react";
import PropTypes from "prop-types";
import { Switch, Route, Redirect } from "react-router-dom";
import { Spin } from "antd";
import { defaultRoutes } from "@conf/routes";
import asyncComps from "@conf/asyncComps";

class AuthorizedRouter extends Component {
	static propType = {
		permissionList: PropTypes.array.isRequired,
	};
	//收集需要渲染的路由组件
	renderRoute = (menuList, parentPath = "") => {
		return menuList.reduce((routes, menu) => {
			const { component, redirect, children, path } = menu;
			//判断要不要渲染组件
			if (component) {
				//再 asyncComps 当中找到对应的组件,因为是懒加载，所以要调用
				const Component = asyncComps[component]();
				//收集需要渲染的路由组件
				routes.push(
					<Route
						key={path}
						path={parentPath + path}
						component={Component}
						exact
					/>
				);
			}
			//如果有children 注意：坑：如果redirect在上，那么就会一直命中redirect
			if (children && children.length) {
				//递归
				routes = routes.concat(this.renderRoute(children, path));
				console.log(routes);
			}

			//判断是否有  redirect
			if (redirect && redirect !== "noredirect") {
				routes.push(
					// 只写to，代表匹配任意路径，任意路径都会跳转
					// 问题：所有路径都会跳转
					// <Redirect key={path} to={} />
					// from to
					// 只有路径 是以from开头 情况下，才会自动跳转
					<Redirect key={path} from={path} to={redirect} />
				);
			}
			return routes;
		}, []);
	};
	render() {
		const { permissionList } = this.props;
		return (
			<Suspense fallback={<Spin size="large" />}>
				<Switch>
					{this.renderRoute(defaultRoutes)}
					{this.renderRoute(permissionList)}
				</Switch>
			</Suspense>
		);
	}
}

export default AuthorizedRouter;
