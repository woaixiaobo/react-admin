import React , {useEffect,useState} from 'react'
import { Card ,Form , Input , Button, Select ,message} from 'antd';
import {Link} from "react-router-dom"
import { ArrowLeftOutlined } from "@ant-design/icons";
import "./index.less"
import {connect} from "react-redux"
import {getSubjectList} from "../../redux/actions"
import { reqAddSubject } from "@api/edu/subject";

const { Option } = Select;

/**
 * 添加组件流程：
 * 1.创建组件
 * 2.在config当中暴露出去
 * 3.配置权限（在页面菜单管理/课程分类管理 添加响应的权限）
 * 4.在角色管理 / admin 添加相应的权限
 * 完成全部步骤后才可以访问这个页面
 */
    //点击更多时页数的增加
    let page =  1;
function AddSubject ({subjectList,getSubjectList,history}) {
    // 表单的布局属性
    const  layout= {
        labelCol: { span: 5 }, // label文字所占宽度比例
        wrapperCol: { span: 5 }, // 右边Input的占宽度比例
    };
    //验证成功的回调
    const onFinish=async (values)=>{
        const {title,parentId} = values;
        console.log(title,parentId);

        await reqAddSubject(title, parentId);
        //提示添加数据成功
        message.success("数据添加成功")
        history.push("/edu/subject/list");
    }
    //工厂函数使用state数据管理
    const [subjects, setSubjects] = useState([]);

    //工厂函数声明周期，发送请求数据
    useEffect(()=>{
        // getSubjectList(page++,10)
        //因为 getSubjectList 的actions在定义时返回的就是一个promise的结果
        const fetchData = async()=>{
            const items = await getSubjectList(page++,10)
            setSubjects(items)                     
        }
        fetchData();
    },[getSubjectList])

    //点击加载更多数据
    const loadMore = async()=>{
        const items = await getSubjectList(page++, 10);
        
        setSubjects([...subjects, ...items]);
    }
    return (
        <div>
            <Card title={
                <>
                    <Link to="/edu/subject/list">
                        <ArrowLeftOutlined />
                    </Link>
                    <span className="title">添加课程分类</span>
                </>
            } >
                <Form
                    {...layout}
                    name="basic"
                    onFinish={onFinish}
                    // onFinishFailed={onFinishFailed}
                >
                    <Form.Item
                    label="课程分类名称" // 左侧文字
                    name="title" // 指定当前表单项将来收集数据的key属性
                    rules={[{ required: true, message: "请输入课程分类名称~" }]} // 校验规则
                    >
                    <Input />
                    </Form.Item>

                    <Form.Item
                    label="父级分类"
                    name="parentId"
                    rules={[{ required: true, message: "请选择父级分类" }]}
                    >
                    <Select
                    // 在列表的最后添加额外元素
                    dropdownRender={(menu) => (
                        <div>
                            {menu}
                        
                            {/* 判断总长度是否小于等于最新数据的长度，如果满足条件，说明数据已经全部请求回来了~ */}
                            {subjectList.total <= subjects.length ? (
                            "没有更多数据了~"
                            ) : (
                            <Button type="link" onClick={loadMore}>
                                加载更多数据
                            </Button>
                            )}
                            
                        </div>
                        )}
                    >
                        <Option key={0} value="0">一级分类</Option>
                        {subjectList.items.map((subject,index)=>{
                            return <Option key={index + 1} value={subject._id}>{subject.title}</Option>
                        })}
                    </Select>
                    </Form.Item>

                    <Form.Item>
                    <Button type="primary" htmlType="submit">
                        添加
                    </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    )
}
export default connect((state)=>({subjectList:state.subjectList}),{getSubjectList})(AddSubject)