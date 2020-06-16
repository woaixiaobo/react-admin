import React, { Component } from "react";
import { DonutChart } from "bizcharts";
import { Card, Button, Radio } from "antd";
class Search extends Component {
	state = {
		radioValue: "all",
	};
	handleSizeChange = (e) => {
		this.setState({ size: e.target.value });
	};

	// 数据源
	data = [
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
	render() {
		return (
			<Card
				title="销售额类型占比"
				extra={
					<Radio.Group value={this.radioValue} onChange={this.handleSizeChange}>
						<Radio.Button value="all">全部渠道</Radio.Button>
						<Radio.Button value="line">线上</Radio.Button>
						<Radio.Button value="shop">门店</Radio.Button>
					</Radio.Group>
				}
			>
				<DonutChart
					data={this.data}
					// title={{
					// 	visible: true,
					// 	text: "环图",
					// }}
					forceFit
					// description={{
					// 	visible: true,
					// 	text: "环图的外半径决定环图的大小，而内半径决定环图的厚度。",
					// }}
					statistic={{
						visible: true,
						totalLabel: "销售额 ",
					}}
					radius={0.8}
					padding="auto"
					angleField={`value`} //扇形区域的值
					colorField="type" //扇形区域的颜色
				/>
			</Card>
		);
	}
}

export default Search;
