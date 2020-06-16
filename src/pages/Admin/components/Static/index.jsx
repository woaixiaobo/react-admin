import React, { Component } from "react";
import { Tabs, Radio } from "antd";
import {
	G2,
	Chart,
	Geom,
	Axis,
	Tooltip,
	Coord,
	Label,
	Legend,
	View,
	Guide,
	Shape,
	Facet,
	Util,
	RingProgressChart,
	Annotation,
} from "bizcharts";

const { TabPane } = Tabs;
const data = [...Array(30).keys()].map((i) => {
	return {
		key: i + 1,
		percent: +Math.random().toFixed(1),
	};
});

const lineData = [
	{
		month: "Jan",
		city: "Tokyo",
		temperature: 7,
	},
	{
		month: "Jan",
		city: "London",
		temperature: 3.9,
	},
	{
		month: "Feb",
		city: "Tokyo",
		temperature: 6.9,
	},
	{
		month: "Feb",
		city: "London",
		temperature: 4.2,
	},
	{
		month: "Mar",
		city: "Tokyo",
		temperature: 9.5,
	},
	{
		month: "Mar",
		city: "London",
		temperature: 5.7,
	},
	{
		month: "Apr",
		city: "Tokyo",
		temperature: 14.5,
	},
	{
		month: "Apr",
		city: "London",
		temperature: 8.5,
	},
	{
		month: "May",
		city: "Tokyo",
		temperature: 18.4,
	},
	{
		month: "May",
		city: "London",
		temperature: 11.9,
	},
	{
		month: "Jun",
		city: "Tokyo",
		temperature: 21.5,
	},
	{
		month: "Jun",
		city: "London",
		temperature: 15.2,
	},
	{
		month: "Jul",
		city: "Tokyo",
		temperature: 25.2,
	},
	{
		month: "Jul",
		city: "London",
		temperature: 17,
	},
	{
		month: "Aug",
		city: "Tokyo",
		temperature: 26.5,
	},
	{
		month: "Aug",
		city: "London",
		temperature: 16.6,
	},
	{
		month: "Sep",
		city: "Tokyo",
		temperature: 23.3,
	},
	{
		month: "Sep",
		city: "London",
		temperature: 14.2,
	},
	{
		month: "Oct",
		city: "Tokyo",
		temperature: 18.3,
	},
	{
		month: "Oct",
		city: "London",
		temperature: 10.3,
	},
	{
		month: "Nov",
		city: "Tokyo",
		temperature: 13.9,
	},
	{
		month: "Nov",
		city: "London",
		temperature: 6.6,
	},
	{
		month: "Dec",
		city: "Tokyo",
		temperature: 9.6,
	},
	{
		month: "Dec",
		city: "London",
		temperature: 4.8,
	},
];
const cols = {
	month: {
		range: [0, 1],
	},
	revenue: {
		max: 30,
	},
};
class Static extends Component {
	state = {
		mode: "top",
	};
	handleModeChange = (e) => {
		const mode = e.target.value;
		this.setState({ mode });
	};
	render() {
		const { mode } = this.state;
		return (
			<div className="static">
				<Tabs
					// defaultActiveKey="1" //默认再第一个
					// tabPosition={mode} //页签位置
					style={{ height: 600 }}
				>
					{data.map((item) => (
						<TabPane
							key={item.key}
							tab={
								<div>
									<h3>store{item.key}</h3>
									<RingProgressChart
										width={30}
										height={30}
										percent={item.percent}
									/>
								</div>
							}
						>
							<Chart height={400} data={lineData} autoFit>
								<Legend position="top" />
								<Axis name="month" />
								<Axis
									name="temperature"
									label={{
										formatter: (val) => `${val}°C`,
									}}
								/>
								<Tooltip
									crosshairs={{
										type: "y",
									}}
								/>
								<Geom
									type="line"
									position="month*temperature"
									size={2}
									color={"city"}
									shape={"smooth"}
								/>
								<Geom
									type="point"
									position="month*temperature"
									size={4}
									shape={"circle"}
									color={"city"}
									style={{
										stroke: "#fff",
										lineWidth: 1,
									}}
								/>
							</Chart>
						</TabPane>
					))}
				</Tabs>
			</div>
		);
	}
}

export default Static;