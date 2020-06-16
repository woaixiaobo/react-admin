import React, { Component } from "react";
import { Card, Radio } from "antd";
import {
	Chart,
	registerShape,
	Geom,
	Axis,
	Tooltip,
	Interval,
	Interaction,
	Coordinate,
	Annotation,
	Legend,
} from "bizcharts";
// 可以通过调整这个数值控制分割空白处的间距，0-1 之间的数值
const sliceNumber = 0.01; // 自定义 other 的图形，增加两条线

registerShape("interval", "sliceShape", {
	draw(cfg, container) {
		const points = cfg.points;
		let path = [];
		path.push(["M", points[0].x, points[0].y]);
		path.push(["L", points[1].x, points[1].y - sliceNumber]);
		path.push(["L", points[2].x, points[2].y - sliceNumber]);
		path.push(["L", points[3].x, points[3].y]);
		path.push("Z");
		path = this.parsePath(path);
		return container.addShape("path", {
			attrs: {
				fill: cfg.color,
				path: path,
			},
		});
	},
});

class Search extends Component {
	state = {
		radioValue: "all",
		data: [],
		total: 0,
	};
	componentDidMount() {
		setTimeout(() => {
			// 数据源
			const data = [
				{
					type: "分类一",
					value: 27,
				},
				{
					type: "分类二",
					value: 25,
				},
				{
					type: "分类三",
					value: 18,
				},
				{
					type: "分类四",
					value: 15,
				},
				{
					type: "分类五",
					value: 10,
				},
				{
					type: "其它",
					value: 5,
				},
			];
			// console.log(data);
			this.setState({ data, total: data.reduce((p, c) => p + c.value, 0) });
		}, 1000);
	}
	onRadioChange = (e) => {
		this.setState({
			radioValue: e.target.value,
		});
	};

	count = (value) => {
		return (
			(
				(value / this.state.data.reduce((p, c) => p + c.value, 0)) *
				100
			).toFixed(2) + "%"
		);
	};
	//点击切换时显示数据
	IntervalClick = (ev) => {
		const data = ev.data;
		this.setState({
			total: data.data.value,
		});
	};
	render() {
		return (
			<Card
				title="销售额类型占比"
				extra={
					<Radio.Group
						onChange={this.onRadioChange}
						value={this.state.radioValue}
					>
						<Radio.Button value="all">全部渠道</Radio.Button>
						<Radio.Button value="line">线上</Radio.Button>
						<Radio.Button value="shop">门店</Radio.Button>
					</Radio.Group>
				}
			>
				<Chart
					data={this.state.data}
					height={500}
					autoFit
					onIntervalClick={this.IntervalClick}
				>
					{/* 饼状图  radius外圈半径 innerRadius内圈半径 */}
					<Coordinate type="theta" radius={0.8} innerRadius={0.75} />
					{/* 坐标轴是否隐藏 */}
					<Axis visible={false} />
					<Tooltip
						showTitle={false}
						itemTpl={
							// 鼠标移入元素中显示内容
							"<li style='height: 20px;' data-index={index} >" +
							'<span style="background-color:{color};width:8px;height:8px;border-radius:50%;display:inline-block;margin-right:8px;"></span>' +
							"{name}: ¥ {value}" +
							"</li>"
						}
					/>
					<Interval
						adjust="stack"
						position="value"
						color="type"
						shape="sliceShape"
					/>
					<Annotation.Text
						position={["50%", "45%"]}
						content="销售量"
						style={{
							lineHeight: "240px",
							fontSize: "30",
							fill: "#262626",
							textAlign: "center",
						}}
					/>
					<Annotation.Text
						position={["50%", "55%"]}
						content={this.state.total}
						style={{
							lineHeight: "240px",
							fontSize: "30",
							fill: "#262626",
							textAlign: "center",
						}}
					/>
					<Interaction type="element-single-selected" />
					<Legend position="right" />
				</Chart>
			</Card>
		);
	}
}

export default Search;
