import {
  GET_ALL_COURSE_LIST,
  GET_CHAPTER_LIST,
  GET_LESSON_LIST,
  BATCH_REMOVE_LESSON_LIST,
  BATCH_REMOVE_Capters_LIST,
} from "./constants"
const initChapter = {
  allCourseList: [],
  chapters: {
    total: 0,
    items: [],
  },
}
export default function chapter(prevState = initChapter, action) {
  switch (action.type) {
    case GET_ALL_COURSE_LIST:
      return {
        ...initChapter,
        allCourseList: action.data,
      };
    case GET_CHAPTER_LIST:
      return {
        ...prevState,
        chapters: {
          total: action.data.total,
          items: action.data.items.map(chapter => {
            return {
              ...chapter,
              children: [], //展开项的前提条件
            }
          })
        }
      };
    case GET_LESSON_LIST:
      return {
        ...prevState,
        chapters: {
          total: action.data.total,
          items: prevState.chapters.items.map(chapter => {
            if (chapter._id === action.data.chapterId) {
              return {
                ...chapter,
                children: action.data.lessons, //展开项的前提条件
              }
            }
            return chapter;
          })
        }
      }
      case BATCH_REMOVE_LESSON_LIST:
        return {
          ...prevState,
          chapters: {
            total: prevState.chapters.total,
            items: prevState.chapters.items.map(chapter => {
              //找到要章节下的课时 children
              let children = chapter.children;
              //如果存在才进行删除,不存在就返回
              if (children && children.length) {
                //过滤要删除的课时id
                children = children.filter(
                  item => action.data.indexOf(item._id) === -1
                )
              }
              return {
                ...chapter,
                children,
              }
            })
          }
        }
        case BATCH_REMOVE_Capters_LIST:
          console.log(prevState.chapters.items.filter(chapter => action.data.indexOf(chapter._id) === -1));

          return {
            ...prevState,
            chapters: {
              total: prevState.chapters.total,
              items: prevState.chapters.items.filter(chapter => action.data.indexOf(chapter._id) === -1)
            }
          }
          default:
            return prevState;
  }
}