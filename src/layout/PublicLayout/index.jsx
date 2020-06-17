import React, { Component, Suspense } from "react";
import { Switch, Route } from "react-router-dom";
import { constantRoutes } from "@conf/routes";

//loading 组件
const Loading = <div>loading...</div>;

class PublicLayout extends Component {
	renderRoutes = (routes) => {
		return routes.map((route) => {
			//Route组件,根据path的变化,自动加载响应的组件
			return (
				<Route
					key={route.path}
					path={route.path}
					component={route.component}
					exact
				/>
			);
		});
	};
	render() {
		return (
			//懒加载的时候是loading组件
			<Suspense fallback={Loading}>
				<Switch>{this.renderRoutes(constantRoutes)}</Switch>
			</Suspense>
		);
	}
}

export default PublicLayout;
