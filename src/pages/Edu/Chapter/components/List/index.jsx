import React, { Component } from "react";
import { Button, Tooltip, Alert, Table, Modal } from "antd";
import Player from "griffith";
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
import { getLessonList } from "../../redux";
import { withRouter } from "react-router-dom";

@withRouter
@connect((state) => ({ chapters: state.chapter.chapters }), {
  getLessonList,
})
class List extends Component {
  state = {
    expandedRowKeys: [],
    isShowVideoModal: false, // Modal显示与隐藏
    lesson: {}, // 显示的数据
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
  render() {
    const { chapters } = this.props;
    const { expandedRowKeys, isShowVideoModal, lesson } = this.state;
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
            <Button type="danger">批量删除</Button>
            <Tooltip title="全屏">
              <FullscreenOutlined />
            </Tooltip>
            <Tooltip title="刷新">
              <ReloadOutlined />
            </Tooltip>
            <Tooltip title="设置">
              <SettingOutlined />
            </Tooltip>
          </div>
        </div>
        <Alert message="已选择 0 项" type="info" showIcon />
        <Table
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
