//管理课程分类数据的redux,主要是对数据的请求获取
//引入API 
import {reqGetSubjectList,reqGetSubSubjectList} from "@api/edu/subject"
//引入常量
import {GET_SUBJECT_LIST,GET_SUB_SUBJECT_LIST} from "./constans"

//获取课程分类的数据
const getSubjectListSync = (subjectList) =>({
    type:GET_SUBJECT_LIST,
    data:subjectList,
})

export const getSubjectList = (page,limit)=>{
    return(dispatch)=>{
        //执行异步代码,获取数据
        return reqGetSubjectList(page,limit).then(response=>{
            //更新redux的数据
            dispatch(getSubjectListSync(response));
            return response.items
        })
    }
}

//获取二级课程分类数据
const getSubSubjectListSync = (data)=>({
    type:GET_SUB_SUBJECT_LIST,
    data,
})
export const getSubSubjectList=(parentId)=>{
    return (dispatch)=>{
        return reqGetSubSubjectList(parentId).then((response)=>{
            console.log(response);
            
            dispatch(
                getSubSubjectListSync({parentId,subjectList:response.items})
            )
            console.log(response.items);
            
            return response
        })
    }
}