import React, { Component } from "react";
import {
	Button,
	Tooltip,
	Alert,
	Table,
	Modal,
	message,
	Popconfirm,
} from "antd";
import Player from "griffith";
//全屏工具包
import screenfull from "screenfull";

import "./index.less";
import {
	PlusOutlined,
	FullscreenOutlined,
	ReloadOutlined,
	SettingOutlined,
	FormOutlined,
	DeleteOutlined,
	EyeOutlined,
} from "@ant-design/icons";
import { connect } from "react-redux";
import {
	getLessonList,
	batchRemoveLessonList,
	batchRemoveCaptersList,
	getChapterList,
} from "../../redux";
import { withRouter } from "react-router-dom";
import PubSub from "pubsub-js";

@withRouter
@connect((state) => ({ chapters: state.chapter.chapters }), {
	getLessonList,
	batchRemoveLessonList,
	batchRemoveCaptersList,
	getChapterList,
})
class List extends Component {
	state = {
		expandedRowKeys: [],
		isShowVideoModal: false, // Modal显示与隐藏
		lesson: {}, // 显示的数据
		selectedRowKeys: [], //选中的数据的集合
		courseId: "",
	};
	handleExpandedRowsChange = (expandedRowKeys) => {
		const length = expandedRowKeys.length;
		if (length > this.state.expandedRowKeys.length) {
			const lastKey = expandedRowKeys[length - 1];
			this.props.getLessonList(lastKey);
		}

		this.setState({
			expandedRowKeys,
		});
	};
	//显示addlesson 添加课时页面
	showAddLesson = (chapter) => {
		return () => {
			console.log(11);
			//注意的是这个组件不是路由组件，没有三大属性，所以用 withRouter 解决
			this.props.history.push("/edu/chapter/addlesson", chapter);
		};
	};
	//点击显示视频
	showVideoModal = (lesson) => {
		return () => {
			this.setState({
				isShowVideoModal: true,
				lesson,
			});
		};
	};
	hidden = () => {
		this.setState({
			isShowVideoModal: false,
			lesson: {},
		});
	};
	onSelectChange = (selectedRowKeys) => {
		// console.log(selectedRowKeys);
		//讲选中的数据进行保存,更新state数据
		this.setState({
			selectedRowKeys,
		});
	};
	batchRemove = async () => {
		//获取id,既有章节,又有课时的
		const { selectedRowKeys } = this.state;
		//要区别是章节id还是课时id就要得到所有的数据,然后进行判断
		const {
			chapters: { items: chapters }, //对chapters进行解构赋值, chapters: aaa:是对chapters进行重命名
			batchRemoveLessonList,
			batchRemoveCaptersList,
		} = this.props;
		//所有id的集合,对这个数组进行操作,将id列表分为章节id和课时id
		const ids = Array.from(selectedRowKeys); //语法是es6,ie是不支持的,所以webpack会进行babelk,
		//但是打包文件会变大,所以可以使用ES5的 Array,prototype.slice.call(arr) || arr.slice  克隆原数组
		console.log(ids);
		//定义章节id的容器
		const chapterIds = [];
		chapters.forEach((chapter) => {
			//判断这个id是否是章节的,存在返回下标,不存在就是课程的返回-1
			const index = ids.indexOf(chapter._id);
			if (index > -1) {
				//如果找到这个章节id, 返回删除元素的数组
				const [id] = ids.splice(index, 1);
				//添加到章节id容器当中
				chapterIds.push(id);
			}
		});
		//发送删除请求
		await batchRemoveLessonList(ids);
		await batchRemoveCaptersList(chapterIds);
		message.success("批量删除成功");
	};
	cancel = (e) => {
		console.log(e);
		message.error("Click on No");
	};
	//全屏功能
	screenfull = () => {
		//获取真实的dom元素
		const dom = this.props.fullscreenRef.current;
		//显示全屏,此时俺esc建退出全屏
		// screenfull.toggle(dom)
		//此时点击按钮可以在全屏和不全屏之间切换
		screenfull.toggle(dom);
	};
	componentDidMount() {
		//订阅信息
		PubSub.subscribe("RECIVE_DATA", (msg, data) => {
			console.log("Child接受到了数据", msg, data);
			this.setState({
				courseId: data,
			});
		});
	}
	//点击更新页面数据
	updateCapters = async () => {
		const { getChapterList } = this.props;
		getChapterList({ page: 1, limit: 10, courseId: this.state.courseId });
	};
	render() {
		const { chapters } = this.props;
		const {
			expandedRowKeys,
			isShowVideoModal,
			lesson,
			selectedRowKeys,
		} = this.state;
		const columns = [
			{
				title: "名称",
				dataIndex: "title",
				key: "title",
			},
			{
				title: "是否免费",
				dataIndex: "free",
				key: "free",
				render: (free) => {
					return free === undefined ? "" : free ? "是" : "否";
				},
			},
			{
				title: "视频",
				key: "video",
				render: (lesson) => {
					return (
						"video" in lesson && (
							<Tooltip title="预览视频">
								<Button onClick={this.showVideoModal(lesson)}>
									<EyeOutlined />
								</Button>
							</Tooltip>
						)
					);
				},
			},
			{
				title: "操作",
				key: "action",
				width: 250,
				render: (data) => {
					return (
						<>
							{"free" in data ? null : (
								<Tooltip title="新增课时">
									<Button
										type="primary"
										className="chapter-btn"
										onClick={this.showAddLesson(data)}
									>
										<PlusOutlined />
									</Button>
								</Tooltip>
							)}
							<Tooltip title="更新">
								<Button
									type="primary"

									// onClick={this.showUpdateSubject(subject)}
								>
									<FormOutlined />
								</Button>
							</Tooltip>
							<Tooltip title="删除">
								<Button
									type="danger"
									className="subject-btn"
									// onClick={this.delSubject(subject)}
								>
									<DeleteOutlined />
								</Button>
							</Tooltip>
						</>
					);
				},
			},
		];
		return (
			<div className="chapter-list">
				<div className="chapter-list-header">
					<h5>课程章节列表</h5>
					<div>
						<Button type="primary">
							<PlusOutlined />
							新增
						</Button>
						<Popconfirm
							title="确定删除这个课时嘛?"
							onConfirm={this.batchRemove}
							onCancel={this.cancel}
							okText="Yes"
							cancelText="No"
						>
							<Button type="danger">批量删除</Button>
						</Popconfirm>

						<Tooltip title="全屏">
							<FullscreenOutlined onClick={this.screenfull} />
						</Tooltip>
						<Tooltip title="刷新">
							<ReloadOutlined onClick={this.updateCapters} />
						</Tooltip>
						<Tooltip title="设置">
							<SettingOutlined />
						</Tooltip>
					</div>
				</div>
				<Alert
					message={`已选择 ${selectedRowKeys.length} 项`}
					type="info"
					showIcon
				/>
				<Table
					rowSelection={{
						selectedRowKeys,
						onChange: this.onSelectChange,
					}}
					className="chapter-list-table"
					columns={columns} //列头
					//展开项
					expandable={{
						expandedRowKeys,
						onExpandedRowsChange: this.handleExpandedRowsChange,
					}}
					dataSource={chapters.items} //决定每行显示的数据
					rowKey="_id" // 指定key属性的值是_id
					pagination={{
						showQuickJumper: true, //是否显示快速跳转
						showSizeChanger: true, //是否显示修改页数数量
						pageSizeOptions: ["5", "10", "15", "20"],
						defaultPageSize: 10, //默认每页的数量
					}}
				></Table>
				<Modal
					title={lesson.title}
					visible={isShowVideoModal}
					onCancel={this.hidden}
					footer={null}
					centered //居中垂直
					destroyOnClose={true} //关闭时销毁子元素
				>
					<Player
						id="video"
						// cover="http://localhost:3000/static/media/logo.ba1f87ec.png" //封面提
						sources={{
							hd: {
								play_url: lesson.video,
								// "https://zhstatic.zhihu.com/cfe/griffith/zhihu2018_hd.mp4",
							},
						}}
					/>
				</Modal>
			</div>
		);
	}
}
export default List;
