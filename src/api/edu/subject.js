import request from "@utils/request"
//模块请求的公共路径前缀,访问真正的接口,内部会通过服务器代理转发到接口地址
const BASE_URL = "/admin/edu/subject"
//mock地址
const MOCK_BASE_URL = `http://localhost:8000${BASE_URL}`;
//获取一级分类列表数据
export function reqGetSubjectList(page,limit){
    return request({
        url:`${MOCK_BASE_URL}/${page}/${limit}`,
        method:"GET",
    })
}
//获取二级分类列表数据
export function reqGetSubSubjectList(parentId){
    return request({
        url:`${MOCK_BASE_URL}/get/${parentId}`,
        method:"GET",
    })
}

//添加课程的分类数据
export function reqAddSubject(title,parentId){ 
    return request({
        url:`${MOCK_BASE_URL}/save`,
        method:"POST",
        data:{
            title,
            parentId
        }
    })
}