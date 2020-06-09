import React,{Component} from "react"
import { Button ,Table } from 'antd';
import { PlusOutlined,FormOutlined ,DeleteOutlined} from "@ant-design/icons";
import "./index.less"
import { reqGetSubjectList } from "@api/edu/subject";

export default class Subject extends Component{
  //初始化结构
  state={
    subjects:{
      total:0,
      items:[],
    }
  }
  async componentDidMount(){
    this.getSubjectList(1,10);
  }
  getSubjectList = async (page,limit)=>{
    // console.log(page,limit);
    const result =  await reqGetSubjectList(page,limit);
    // console.log(result);
    //更新数据
    this.setState({
      subjects:result,
    })
  }
  sizeChange= async (current,size)=>{
    console.log(current,size);
    this.getSubjectList(current,size)
  }
  render(){
    const columns = [
      { title: '分类名称', dataIndex: 'title', key: 'title' },
      {
        title: '操作',
        dataIndex: '',
        width:200,
        key: 'x',
        render: () => (
          <>
            <Button type="primary">
              <FormOutlined />
            </Button>
            <Button type="danger" className="subject-btn">
              <DeleteOutlined />
            </Button>
          </>
        ),
      },
    ];
    
    //动态数据
    const {subjects} = this.state
    // const data = [
    //   {
    //     key: 1,
    //     name: 'John Brown',
    //     age: 32,
    //     address: 'New York No. 1 Lake Park',
    //     description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.',
    //   },
      
    // ];
    
    return(
      <div className="subject">
        <Button type="primary" className="subject-btn"><PlusOutlined />新建</Button>
        <Table
          //决定列头
          columns={columns}
          //决定列是否可以展开
          //决定列展开时的内容
          expandable={{
            expandedRowRender: record => <p style={{ margin: 0 }}>{record.description}</p>,
            rowExpandable: record => record.name !== 'Not Expandable',
          }}
          dataSource={subjects.items} //每行显示的数据
          rowKey="_id" //指定key属性的值是_id
          pagination={{
            total:subjects.total,//数据总数
            showQuickJumper:true,//是否显示快速跳转
            showSizeChanger:true,//是否显示修改每页显示数量
            pageSizeOptions:["5","10","15","20"],
            defaultPageSize:10,
            onChange : this.getSubjectList,//页码发生变化触发的回调
            onShowSizeChange: this.sizeChange,//数量改变的回调
          }}
        />,
        mountNode,
      </div>
    )
  }
}