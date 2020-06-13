import React, { useEffect } from "react";
import { Form, Select, Button, message } from "antd";
import "./index.less";
//引入action当中的请求所有课程数据的方法
import { getAllCourseList, getChapterList } from "../../redux";
import { connect } from "react-redux";
import PubSub from "pubsub-js";

const { Option } = Select;
function Search({ getAllCourseList, allCourseList, getChapterList }) {
  // Form组件提供hooks函数 useForm（只能在工厂函数组件使用，不能在ES6类组件使用）
  // 该函数作用就是提供一个form对象，让我们可以对表单进行各种操作
  const [form] = Form.useForm();
  const resetForm = () => {
    form.resetFields(); //重置所有表单项
    // form.resetFields(['title']);//重置title对象的name表单项
  };
  const onFinish = async ({ courseId }) => {
    // console.log("Success:", courseId);
    //发送获取章节列表请求
    await getChapterList({ page: 1, limit: 10, courseId });
    //发送数据
    PubSub.publish("RECIVE_DATA", courseId);
    message.success("获取章节数据成功");
  };
  useEffect(() => {
    //请求所有课程数据
    getAllCourseList();
  }, [getAllCourseList]);

  return (
    <Form
      layout="inline"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      className="chapter-search"
      form={form}
    >
      <Form.Item
        label="选中课程"
        name="courseId"
        rules={[{ required: true, message: "请选择课程!" }]}
      >
        <Select placeholder="请选择课程分类" className="chapter-search-select">
          {allCourseList.map((course) => {
            return (
              <Option key={course._id} value={course._id}>
                {course.title}
              </Option>
            );
          })}
        </Select>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          查询课程章节
        </Button>
        <Button className="subject-btn" onClick={resetForm}>
          重置
        </Button>
      </Form.Item>
    </Form>
  );
}

export default connect(
  (state) => ({ allCourseList: state.chapter.allCourseList }),
  {
    getAllCourseList,
    getChapterList,
  }
)(Search);
