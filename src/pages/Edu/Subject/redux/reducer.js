import { GET_SUBJECT_LIST,GET_SUB_SUBJECT_LIST} from "./constans";

//初始化数据
const initSubjectList={
    total:0,//总数量
    items:[],//课程分类数据列表
}

export default function subjectList(prevState=initSubjectList,action){
    switch(action.type){
        case GET_SUBJECT_LIST://课程分类
        // console.log(action.data);
            return {
                total:action.data.total,
                items:action.data.items.map((subject)=>{
                    return {
                        ...subject,
                        children:[],//添加children属性，当前项就是可展开项，才会显示展开图标
                    }
                })
            };
        case GET_SUB_SUBJECT_LIST:
            //讲二级分类数据添加到某个一级分类数据上（children）
            const {parentId,subjectList} = action.data;
            // console.log(action);
            return{
                total:prevState.total,
                items:prevState.items.map((subject)=>{
                    if(subject._id===parentId){
                        subject.children = subjectList;
                    }
                    return subject
                })
            }
        default:
            return prevState;
    }
}