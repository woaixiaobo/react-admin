//引入请求所有课程数据的api
import {
    reqGetAllCourseList
} from "@api/edu/course"
//引入类型变量
import {
    GET_ALL_COURSE_LIST
} from "./constants"

//请求所有课程数据
const getAllCourseListSync = (courseList) => ({
    type: GET_ALL_COURSE_LIST,
    data: courseList,
})

//异步请求
export const getAllCourseList = () => {
    return (dispatch) => {
        return reqGetAllCourseList().then(response => {
            console.log(response);

            dispatch(getAllCourseListSync(response));
            return response;
        })
    }
}