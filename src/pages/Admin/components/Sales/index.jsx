import React from "react";
import { Card, Button, DatePicker } from "antd";
import { Component } from "react";
import moment from "moment";

const tabList = [
	{
		key: "tab1",
		tab: "销售量",
	},
	{
		key: "tab2",
		tab: "访问量",
	},
];

const contentList = {
	tab1: <p>content1</p>,
	tab2: <p>content2</p>,
};
//日期选择器
const { RangePicker } = DatePicker;
const dateFormat = "YYYY-MM-DD";

export default class Sales extends Component {
	state = {
		key: "tab1",
		noTitleKey: "app",
		datePicker: "day",
		rangeTime: [
			//时间选择器的默认时间，两个的话就代表起始和结束,默认值是当天
			/**
       * moment() 得到当前时间
        .add(7, 'd') 加上7天
        .format(dateFormat) 对上面日期进行格式化
       */
			moment(moment().format(dateFormat), dateFormat),
			moment(moment().format(dateFormat), dateFormat),
		],
	};
	onTabChange = (key, type) => {
		console.log(key, type);
		this.setState({ [type]: key });
	};
	//时间发生变化时的回调,可以使用户自己设置，需要更新界面，否则是没反应的
	rangePickerChange = (dates) => {
		console.log(dates);
		//更新时间数据
		this.setState({
			rangeTime: dates,
		});
	};
	//点击切换日，周，月，年
	changeDatePicker = (datePicker) => {
		return () => {
			//起始时间的初始化
			const time = moment(moment().format(dateFormat), dateFormat);
			//时间容器
			let rangeTime = null;
			switch (datePicker) {
				case "year":
					rangeTime = [
						time,
						moment(moment().add(1, "y").format(dateFormat), dateFormat),
					];
					break;
				case "mouth":
					rangeTime = [
						time,
						moment(moment().add(1, "M").format(dateFormat), dateFormat),
					];
					break;
				case "week":
					rangeTime = [
						time,
						moment(moment().add(7, "d").format(dateFormat), dateFormat),
					];
					break;
				default:
					//当天的情况，起始和结束都是今天，传入初始化值即可
					rangeTime = [time, time];
					break;
			}
			//更新页面
			this.setState({
				datePicker, //更新选中的日期： 年 月 日
				rangeTime, //更新时间范围
			});
		};
	};
	render() {
		const { datePicker, rangeTime } = this.state;
		return (
			<>
				<Card
					tabBarExtraContent={
						<>
							<Button
								type={datePicker === "day" ? "link" : "text"}
								onClick={this.changeDatePicker("day")}
							>
								今日
							</Button>
							<Button
								type={datePicker === "week" ? "link" : "text"}
								onClick={this.changeDatePicker("week")}
							>
								本周
							</Button>
							<Button
								type={datePicker === "mouth" ? "link" : "text"}
								onClick={this.changeDatePicker("mouth")}
							>
								本月
							</Button>
							<Button
								type={datePicker === "year" ? "link" : "text"}
								onClick={this.changeDatePicker("year")}
							>
								本年
							</Button>
							<RangePicker
								value={rangeTime} //默认显示的起始时间和结束时间
								onChange={this.rangePickerChange} //点击时间表时触发的时间，可以让用户自己预设时间
							/>
						</>
					}
					tabList={tabList} // Tab左侧显示的内容
					activeTabKey={this.state.key} // 选中的Tab
					// tabBarExtraContent={extra} // Tab右边显示的内容，也可直接写在上边
					onTabChange={(key) => {
						//点击切换触发的回调
						this.onTabChange(key, "key");
					}}
				>
					{contentList[this.state.key]}
				</Card>
			</>
		);
	}
}
