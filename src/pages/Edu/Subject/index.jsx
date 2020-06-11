import React,{Component} from "react"
import { Button ,Table } from 'antd';
import { PlusOutlined,FormOutlined ,DeleteOutlined} from "@ant-design/icons";
import "./index.less"
// import { reqGetSubjectList } from "@api/edu/subject";
//redux 方法
import {connect} from "react-redux"
import {getSubjectList,getSubSubjectList} from "./redux"

@connect(
  state=>({subjectList:state.subjectList}),
  {
    getSubjectList,//更新数据的方法
    getSubSubjectList,
  }
)
class Subject extends Component{
  state={
    expandedRowKeys:[],//展开项
  }
  //初始化结构
  // state={
  //   subjects:{
  //     total:0,
  //     items:[],
  //   }
  // }
  //声明周期函数，创建完成之前发送初始请求
  async componentDidMount(){
    // this.getSubjectList(1,10);
    this.props.getSubjectList(1,10)
  }
  handleExpand=(expanded,record)=>{
    if(!expanded) return
    console.log(expanded,record);
    //请求一级菜单对应的二级菜单的数据
    this.props.getSubSubjectList(record._id)
  }
  //展开项数量发生变化时触发，参数为展开项的长度，展开增加，缩回减小
  handleExpandedRowsChange=(expandedRowKeys)=>{
    console.log("handleExpandedRowsChange",expandedRowKeys);
    //长度
    const length = expandedRowKeys.length;
    console.log(expandedRowKeys);
    
    //如果最新长度大于之前的长度，说明是展开，需要发送请求
    if(length>this.state.expandedRowKeys.length){
      //点击后数组会再最后增加一项，如果要要显示刚展开的取数组的最后一项即可
      const lastKey = expandedRowKeys[length-1];      
      //发送请求，展开二级菜单
      this.props.getSubSubjectList(lastKey);
    }

    //跟新数据
    this.setState({
      expandedRowKeys
    })
  }
  showAddSubject=()=>{
    this.props.history.push("/edu/subject/add")
  }
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
    const {subjectList,getSubjectList} = this.props;
    const {expandedRowKeys} = this.state;
    return(
      <div className="subject">
        <Button type="primary" onClick={this.showAddSubject} className="subject-btn"><PlusOutlined />新建</Button>
        <Table
          //决定列头
          columns={columns}
          //决定列是否可以展开
          //决定列展开时的内容
          expandable={{
            expandedRowKeys,
            onExpandedRowsChange:this.handleExpandedRowsChange,
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
            total:subjectList.total,//数据总数
            showQuickJumper:true,//是否显示快速跳转
            showSizeChanger:true,//是否显示修改每页显示数量
            pageSizeOptions:["5","10","15","20"],
            defaultPageSize:10,
            onChange : getSubjectList,//页码发生变化触发的回调
            onShowSizeChange:getSubjectList,//数量改变的回调
          }}
        />,
        mountNode,
      </div>
    )
  }
}

export default Subject