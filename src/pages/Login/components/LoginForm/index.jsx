import React, { useState } from "react";
import { Form, Tabs, Input, Button, Checkbox, Row, Col, message } from "antd";
import {
	UserOutlined,
	LockOutlined,
	MobileOutlined,
	GithubOutlined,
	WechatOutlined,
	QqOutlined,
} from "@ant-design/icons";
// import "./index.less";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import { login, mobileLogin } from "@redux/actions/login";
import { reqSendCode } from "@api/acl/oauth";

const { TabPane } = Tabs;
const TOTAL_TIME = 10;
// 倒计时
let countingDownTime = TOTAL_TIME;
//验证规则:
const rules = [
	{
		required: true,
	},
	{
		max: 15,
		message: "输入的长度不能超过15位",
	},
	{
		min: 4,
		message: "输入的长度不能小于4位",
	},
	{
		pattern: /^[a-zA-Z0-9_]+$/,
		message: "输入的内容只能包含数字,英文和下划线",
	},
];
function LoginForm({ login, history, mobileLogin }) {
	// Form表单提供form对象，对表单进行更加细致的操作
	const [form] = Form.useForm();
	//是否已经发送验证码
	const [isSendCode, setIsSendCode] = useState(0);
	//专门用来跟新界面的，因为数据发送变化便需要更新界面
	const [, setCountingDownTime] = useState(0);
	//保存是什么方式登录的状态 user 还是 modile
	const [activeKey, setActiveKey] = useState("user");
	//点击提交时触发的回调
	const finish = async () => {
		if (activeKey === "user") {
			//此时已经没用了验证所有项的功能，所以调用验证项
			form
				.validateFields(["username", "password", "rem"])
				.then(async (valuse) => {
					//收集数据，并且进行表单验证
					const { username, password, rem } = valuse;
					console.log(username);

					//发送请求登录
					const token = await login(username, password);
					//请求成功，rem代表要不要记住密码
					if (rem) {
						//储存到本地持久化储存
						localStorage.setItem("user_token", token);
					}
					//登录成功跳转到主页
					history.replace("/");
				});
			return;
		}
		form.validateFields(["mobile", "code", "rem"]).then(async (valuse) => {
			//收集数据，并且进行表单验证
			const { mobile, code, rem } = valuse;
			//发送请求登录
			const token = await mobileLogin(mobile, code);
			console.log(token);

			//请求成功，rem代表要不要记住密码
			if (rem) {
				//储存到本地持久化储存
				localStorage.setItem("user_token", token);
			}
			//登录成功跳转到主页
			history.replace("/");
		});
	};
	//切换tab时触发的回调函数
	const handleTabChange = (key) => {
		console.log(key);
		//更新是账号密码登录 user 还是手机号登录
		setActiveKey(key);
	};
	//倒计时方法
	const countingDown = () => {
		//利用计时器，内部会有缓存结果，导致更新失败
		const timer = setInterval(() => {
			//更新倒计时
			countingDownTime--;
			if (countingDownTime <= 0) {
				//清除定时器
				clearInterval(timer);
				//重置倒计时
				countingDownTime = TOTAL_TIME;
				//更新状态为未发送短信状态
				setIsSendCode(false);
				//结束返回
				return;
			}
			//单纯为了更新界面，因为倒计时的数字发生了变化，所以需要更新界面
			setCountingDownTime(countingDownTime);
		}, 1000);
	};
	//手机验证码登录
	const sendCode = () => {
		//手动触发表单验证规则，判断用户有没有输入正确的手机号
		form.validateFields(["mobile"]).then(async ({ mobile }) => {
			//发送请求，获取验证码
			console.log(mobile);

			await reqSendCode(mobile);
			//发送成功，更新状态
			setIsSendCode(true);
			//倒计时
			countingDown();
			message.success("验证码发送成功");
		});
	};

	return (
		<div width="250px">
			<Form
				// onFinish={onFinish} //问题：会验证所有的表单
				initialValues={{ rem: "checked" }}
				form={form}
			>
				<Tabs activeKey={activeKey} onChange={handleTabChange}>
					<TabPane tab="账户密码登录" key="user">
						<Form.Item
							// label="Username"
							name="username"
							rules={[
								{ required: true, message: "请输入用户名" },
								{ max: 15, message: "输入的长度不能超过15位" },
								{ min: 4, message: "输入的长度不能小于4位" },
								{
									pattern: /^[a-zA-Z0-9_]+$/,
									message: "输入内容只能包含数字、英文和下划线",
								},
							]}
						>
							<Input prefix={<UserOutlined />} placeholder="用户名: admin" />
						</Form.Item>
						<Form.Item name="password" rules={rules}>
							<Input
								type="password"
								prefix={<LockOutlined />}
								placeholder="密码: 111111"
							/>
						</Form.Item>
					</TabPane>
					<TabPane tab="手机号登录" key="mobile">
						<Form.Item
							name="mobile"
							// 表单校验规则
							rules={[
								{ required: true, message: "请输入手机号" },
								{
									pattern: /^(((13[0-9])|(14[579])|(15([0-3]|[5-9]))|(16[6])|(17[0135678])|(18[0-9])|(19[89]))\d{8})$/,
									message: "请输入正确的手机号",
								},
							]}
						>
							<Input prefix={<MobileOutlined />} placeholder="手机号" />
						</Form.Item>
						<Row justify="space-between">
							<Col>
								<Form.Item
									name="code"
									// 表单校验规则
									rules={[
										{
											required: true,
											message: "请输入验证码",
										},
										{
											pattern: /^[0-9]{6}$/,
											message: "请输入正确的验证码",
										},
									]}
								>
									<Input placeholder="验证码" />
								</Form.Item>
							</Col>
							<Col>
								<Form.Item>
									<Button onClick={sendCode} disabled={isSendCode}>
										{isSendCode
											? `${countingDownTime}秒后可重发`
											: "点击发送验证码"}
									</Button>
								</Form.Item>
							</Col>
						</Row>
					</TabPane>
				</Tabs>
				<Row justify="space-between">
					<Col>
						<Form.Item name="rem" valuePropName="checked">
							<Checkbox>记住密码</Checkbox>
						</Form.Item>
					</Col>
					<Col>
						<Form.Item>
							<Button type="link">忘记密码</Button>
						</Form.Item>
					</Col>
				</Row>
				<Form.Item>
					<Button type="primary" onClick={finish} className="login-form-btn">
						登录
					</Button>
				</Form.Item>
				<Row justify="space-between">
					<Col>
						<Form.Item>
							<div className="login-form-icons">
								<span>其他登录方式</span>
								<GithubOutlined className="icons" />
								<WechatOutlined className="icons" />
								<QqOutlined className="icons" />
							</div>
						</Form.Item>
					</Col>
					<Col>
						<Form.Item>
							<Button type="link">注册</Button>
						</Form.Item>
					</Col>
				</Row>
			</Form>
		</div>
	);
}

export default withRouter(connect(null, { login, mobileLogin })(LoginForm));
