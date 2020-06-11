import React, { Component } from "react";
import { Button, Table, Tooltip, Input, message, Modal } from "antd";
import {
  PlusOutlined,
  FormOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import "./index.less";
// import { reqGetSubjectList } from "@api/edu/subject";
//redux 方法
import { connect } from "react-redux";
import { getSubjectList, getSubSubjectList, updateSubject } from "./redux";
import { reqDelSubject } from "@api/edu/subject";

@connect((state) => ({ subjectList: state.subjectList }), {
  getSubjectList, //更新数据的方法
  getSubSubjectList,
  updateSubject,
})
class Subject extends Component {
  state = {
    expandedRowKeys: [], //展开项
    subjectId: "", // 要更新商品的分类id
    updateSubjectTitle: "", // 正在更新分类的标题
    current: 1, // 当前页数
    pageSize: 10, // 每页条数
  };
  //初始化结构
  // state={
  //   subjects:{
  //     total:0,
  //     items:[],
  //   }
  // }
  //声明周期函数，创建完成之前发送初始请求
  async componentDidMount() {
    // this.getSubjectList(1,10);
    this.getSubjectList(1, 10);
  }
  handleExpand = (expanded, record) => {
    if (!expanded) return;
    console.log(expanded, record);
    //请求一级菜单对应的二级菜单的数据
    this.props.getSubSubjectList(record._id);
  };
  //展开项数量发生变化时触发，参数为展开项的长度，展开增加，缩回减小
  handleExpandedRowsChange = (expandedRowKeys) => {
    console.log("handleExpandedRowsChange", expandedRowKeys);
    //长度
    const length = expandedRowKeys.length;
    console.log(expandedRowKeys);

    //如果最新长度大于之前的长度，说明是展开，需要发送请求
    if (length > this.state.expandedRowKeys.length) {
      //点击后数组会再最后增加一项，如果要要显示刚展开的取数组的最后一项即可
      const lastKey = expandedRowKeys[length - 1];
      //发送请求，展开二级菜单
      this.props.getSubSubjectList(lastKey);
    }

    //跟新数据
    this.setState({
      expandedRowKeys,
    });
  };
  showAddSubject = () => {
    this.props.history.push("/edu/subject/add");
  };
  getFristPageSybject = (page, limit) => {
    this.getSubjectList(1, limit);
  };
  //点击编辑按钮修改数据
  showUpdateSubject = (subjectId) => {
    return () => {
      this.setState({
        subjectId,
      });
    };
  };
  //收集输入的数据
  handleInputChange = (e) => {
    this.setState({
      updateSubjectTitle: e.target.value,
    });
  };
  //点击确认跟新按钮
  updateSubject = async () => {
    //取出数据
    const { subjectId, updateSubjectTitle } = this.state;
    //发送数据跟新数据
    await this.props.updateSubject(updateSubjectTitle, subjectId);
    message.success("跟新分类数据成功");
    //清空数据
    this.cancel();
  };
  //点击取消不跟新数据
  cancel = () => {
    this.setState({
      subjectId: "",
      updateSubjectTitle: "",
    });
  };
  getSubjectList = (page, limit) => {
    this.setState({
      current: page,
      pageSize: limit,
    });
    return this.props.getSubjectList(page, limit);
  };
  //删除数据
  delSubject = (subject) => {
    return () => {
      Modal.confirm({
        title: (
          <p>
            你确认要删除 <span className="subject-text">{subject.title}</span>{" "}
            课程分类吗?
          </p>
        ),
        icon: <ExclamationCircleOutlined />,
        onOk: async () => {
          // 点击确认回调函数
          await reqDelSubject(subject._id);
          // 删除成功
          message.success("删除课程分类数据成功~");
          // 请求新的分页数据~
          const { current, pageSize } = this.state;
          // 删除的数据如果只有一条，应该要跳转到前一页，而且条件是必须是大于1，page>2
          // 删除分类是一级分类
          if (
            current > 1 &&
            this.props.subjectList.items.length === 1 &&
            subject.parentId === "0"
          ) {
            this.getSubjectList(current - 1, pageSize);
            return;
          }

          this.getSubjectList(current, pageSize);
        },
        // onCancel() {
        //   // 点击取消的回调函数
        //   console.log("Cancel");
        // },
      });
    };
  };
  // getSubjectList = async (page,limit)=>{
  //   // console.log(page,limit);
  //   const result =  await reqGetSubjectList(page,limit);
  //   // console.log(result);
  //   //更新数据
  //   this.setState({
  //     subjects:result,
  //   })
  // }
  // sizeChange= async (current,size)=>{
  //   console.log(current,size);
  //   this.getSubjectList(current,size)
  // }
  render() {
    const columns = [
      {
        title: "分类名称",
        key: "title",
        /*
          render方法接受参数看dataIndex的值
          如果dataIndex: title, render方法就能接受title的值
          如果dataIndex: _id, render方法就能接受_id的值
          如果dataIndex: '', render方法就能接受当前所有数据的值
        */
        render: (subject) => {
          //点击按钮要跟新的目标分类的id
          const { subjectId } = this.state;
          if (subjectId === subject._id) {
            return (
              <Input
                className="subject-input"
                defaultValue={subject.title}
                onChange={this.handleInputChange}
              />
            );
          }
          return <span>{subject.title}</span>;
        },
      },
      {
        title: "操作",
        dataIndex: "",
        width: 200,
        key: "x",

        // 默认情况下，渲染的内容是纯文本
        // 如果想渲染成其他方案（按钮）需要用render方法指定
        render: (subject) => {
          //点击按钮要跟新的目标分类的id
          const { subjectId } = this.state;
          //当前id和目标id对比
          if (subjectId === subject._id) {
            return (
              <>
                <Button type="primary" onClick={this.updateSubject}>
                  确认
                </Button>
                <Button className="subject-btn" onClick={this.cancel}>
                  取消
                </Button>
              </>
            );
          }
          return (
            <>
              <Tooltip title="更新课程分类">
                <Button
                  type="primary"
                  onClick={this.showUpdateSubject(subject._id)}
                >
                  <FormOutlined />
                </Button>
              </Tooltip>
              <Tooltip title="删除课程分类">
                <Button
                  type="danger"
                  className="subject-btn"
                  onClick={this.delSubject(subject)}
                >
                  <DeleteOutlined />
                </Button>
              </Tooltip>
            </>
          );
        },
      },
    ];

    //动态数据
    // const {subjects} = this.state
    // const data = [
    //   {
    //     key: 1,
    //     name: 'John Brown',
    //     age: 32,
    //     address: 'New York No. 1 Lake Park',
    //     description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.',
    //   },

    // ];
    const { subjectList } = this.props;
    const { expandedRowKeys, current, pageSize } = this.state;
    return (
      <div className="subject">
        <Button
          type="primary"
          onClick={this.showAddSubject}
          className="subject-btn"
        >
          <PlusOutlined />
          新建
        </Button>
        <Table
          //决定列头
          columns={columns}
          //决定列是否可以展开
          //决定列展开时的内容
          expandable={{
            expandedRowKeys,
            onExpandedRowsChange: this.handleExpandedRowsChange,
            // expandedRowRender: record => {
            //   //判断有没有children
            //   const children = record.children?record.children:[];
            //   return children.map((subSubject)=>{
            //     return (
            //       <div key={subSubject._id} className="sub-subject-row">
            //         <div>{subSubject.title}</div>
            //         <div className="sub-subject-row-right">
            //           <Button type="primary">
            //             <FormOutlined />
            //           </Button>
            //           <Button type="danger" className="subject-btn">
            //             <DeleteOutlined />
            //           </Button>
            //         </div>
            //       </div>
            //     )
            //   })
            // },
            // rowExpandable: record => record.name !== 'Not Expandable',
            // onExpand: this.handleExpand,
          }}
          dataSource={subjectList.items} //每行显示的数据
          rowKey="_id" //指定key属性的值是_id
          pagination={{
            current,
            pageSize,
            total: subjectList.total, //数据总数
            showQuickJumper: true, //是否显示快速跳转
            showSizeChanger: true, //是否显示修改每页显示数量
            pageSizeOptions: ["5", "10", "15", "20"],
            defaultPageSize: 10,
            onChange: this.getSubjectList, //页码发生变化触发的回调
            onShowSizeChange: this.getFristPageSybject, //数量改变的回调
          }}
        />
        , mountNode,
      </div>
    );
  }
}

export default Subject;
