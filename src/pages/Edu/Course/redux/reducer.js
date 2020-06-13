import {
	GET_COURSE_LIST
} from "./contants";

//初始化数据
const initCourseList = {
	total: 0,
	items: [],
}
export default function courseList(prevState = initCourseList, action) {
	switch (action.type) {
		case GET_COURSE_LIST:
			return action.data;
		default:
			return prevState
	}
}