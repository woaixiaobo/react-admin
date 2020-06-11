//将当前的redux汇总起来,方便让外边统一使用
import subjectList from "./reducer"
import {
    getSubjectList,
    getSubSubjectList,
    updateSubject
} from "./actions"
export {
    subjectList, //状态数据
    getSubjectList, //跟新数据的方法
    getSubSubjectList,
    updateSubject
}