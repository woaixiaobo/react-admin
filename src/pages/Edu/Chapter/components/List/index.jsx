import React, { Component } from "react";
import { Button, Tooltip, Alert, Table } from "antd";
import "./index.less";
import {
  PlusOutlined,
  FullscreenOutlined,
  ReloadOutlined,
  SettingOutlined,
} from "@ant-design/icons";
export default class List extends Component {
  render() {
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
          columns={[]} //列头
          //展开项
          expandable={{}}
          dataSource={[]} //决定每行显示的数据
          pagination={{
            showQuickJumper: true, //是否显示快速跳转
            showSizeChanger: true, //是否显示修改页数数量
            pageSizeOptions: ["5", "10", "15", "20"],
            defaultPageSize: 10, //默认每页的数量
          }}
        ></Table>
      </div>
    );
  }
}
