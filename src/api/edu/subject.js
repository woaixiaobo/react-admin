import request from "@utils/request"
//模块请求的公共路径前缀,访问真正的接口,内部会通过服务器代理转发到接口地址
const BASE_URL = "/admin/edu/subject"
//mock地址
const MOCK_BASE_URL = `http://localhost:8000${BASE_URL}`;
//获取一级分类列表数据
export function reqGetSubjectList(page, limit) {
  return request({
    url: `${BASE_URL}/${page}/${limit}`,
    method: "GET",
  })
}

//获取所有一级课程分类
export function reqGetAllSubjectList() {
  return request({
    url: `${BASE_URL}`,
    method: "GET",
  });
}

//获取二级分类列表数据
export function reqGetSubSubjectList(parentId) {
  return request({
    url: `${BASE_URL}/get/${parentId}`,
    method: "GET",
  })
}

//添加课程的分类数据
export function reqAddSubject(title, parentId) {
  return request({
    url: `${BASE_URL}/save`,
    method: "POST",
    data: {
      title,
      parentId
    }
  })
} // 更新课程分类
export function reqUpdateSubject(title, id) {
  return request({
    url: `${BASE_URL}/update`,
    method: "PUT",
    data: {
      // 请求参数
      title,
      id,
    },
  });
}

// 删除课程分类
export function reqDelSubject(id) {
  return request({
    url: `${BASE_URL}/remove/${id}`,
    method: "DELETE",
  });
}