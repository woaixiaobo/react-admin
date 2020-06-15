import React, { useState, useEffect } from "react";
import { Form, Input, Select, Cascader, Button, message } from "antd";
//获取所有讲师的请求
import { reqGetAllTeacherList } from "@api/edu/teacher";
//获取一级分类列表，二级分类列表的请求
import { reqGetAllSubjectList, reqGetSubSubjectList } from "@api/edu/subject";
import { getCourseList } from "../redux";
import { connect } from "react-redux";
//引入国际化
import { FormattedMessage, useIntl } from "react-intl";

//下拉菜单的option要特殊引入
const { Option } = Select;
function SearchForm({ getCourseList, getSearchFormData }) {
	//国际化,显示标签属性
	const intl = useIntl();
	//清空表单数据
	const [form] = Form.useForm();
	const resetForm = () => {
		form.resetFields();
	};
	const [teachers, setTeachers] = useState([]);
	const [subjects, setSubjects] = useState([]);
	useEffect(() => {
		const fetchData = async () => {
			//请求回来的是数组，所以利用解构赋值，并且有名字
			const [teachers, subjects] = await Promise.all([
				//请求所有讲师的数据
				reqGetAllTeacherList(),
				//请求一级分类数据
				reqGetAllSubjectList(),
			]);
			//跟新讲师数据
			setTeachers(teachers);
			//级联选择的数据结构是有要求的，所以对subjects的结构进行处理
			const data = subjects.map((subject) => {
				return {
					value: subject._id, //选择的值
					label: subject.title, //显示名称
					isLeaf: false,
				};
			});
			setSubjects(data);
		};
		fetchData();
	}, []);
	const onChange = (value, selectedOptions) => {
		console.log(value, selectedOptions);
	};
	const loadData = async (selectedOptions) => {
		// console.log(selectedOptions);
		/**
     * selectedOptions 代表当前选中的菜单
      当前是二级菜单：[{}] --> 里面的对象代表点击的一级菜单

      如果将来有三级菜单：[{一级菜单}, {二级菜单}, ....]
      结论：当前点击的菜单就是数组的最后一项值
     */
		const targetOption = selectedOptions[selectedOptions.length - 1];
		//loading属性，出现加载的图标
		targetOption.loading = true;
		//点击一级菜单加载二级菜单
		const { items } = await reqGetSubSubjectList(targetOption.value);
		//加载成功后取消加载对象
		targetOption.loading = false;
		if (items.length) {
			//targetOption 是一级菜单，children属性显示的是二级菜单的数据
			targetOption.children = items.map((item) => {
				return {
					label: item.title,
					value: item._id,
				};
			});
		} else {
			//没有二级菜单，
			targetOption.isLeaf = true;
		}
		setSubjects([...subjects]);
	};
	//点击提交时触发的函数
	const onFinish = async (values) => {
		// console.log(values);
		//取出标题，老师id ， subject
		const {
			title,
			teacherId,
			subject = [], //默认值
		} = values;
		//定义两个变量来盛放一级和二级id
		let subjectId, subjectParentId;
		//存放一级和二级id的变量是个数组
		if (subject.length === 1) {
			//如果长度为1，那么代表只有一级分类
			subjectParentId = "0";
			subjectId = subject[0];
		} else if (subject.length === 2) {
			//长度为2，代表二级分类
			subjectParentId = subject[0];
			subjectId = subject[1];
		}
		//发送请求数据
		await getCourseList({
			title,
			teacherId,
			page: 1,
			limit: 10,
			subjectId,
			subjectParentId,
		});
		//调用父组件方法 给父组件传递数据
		getSearchFormData({ title, teacherId, subjectId, subjectParentId });
		// console.log(getSearchFormData);

		message.success("查询课程分类数据成功~");
	};
	return (
		<Form layout="inline" from={form} onFinish={onFinish}>
			<Form.Item name="title" label={<FormattedMessage id="title" />}>
				<Input
					placeholder={intl.formatMessage({ id: "title" })}
					style={{ width: 250, marginRight: 20 }}
				/>
			</Form.Item>
			<Form.Item name="teacherId" label={<FormattedMessage id="teacher" />}>
				<Select
					placeholder={intl.formatMessage({ id: "teacher" })}
					style={{ width: 250, marginRight: 20 }}
				>
					{teachers.map((teacher) => {
						return (
							<Option key={teacher._id} value={teacher._id}>
								{teacher.name}
							</Option>
						);
					})}
				</Select>
			</Form.Item>
			<Form.Item name="subject" label={<FormattedMessage id="subject" />}>
				<Cascader
					style={{ width: 250, marginRight: 20 }}
					options={subjects}
					loadData={loadData}
					onChange={onChange}
					changeOnSelect
					placeholder={intl.formatMessage({
            id: "subject",
          })}
				/>
			</Form.Item>
			<Form.Item>
				<Button
					type="primary"
					htmlType="submit"
					style={{ margin: "0 10px 0 30px" }}
				>
					{<FormattedMessage id="searchBtn" />}
				</Button>
				<Button onClick={resetForm}>
					{<FormattedMessage id="resetBtn" />}
				</Button>
			</Form.Item>
		</Form>
	);
}
export default connect(null, { getCourseList })(SearchForm);
