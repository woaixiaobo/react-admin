const Mock = require("mockjs");
const express = require('express');
//创建服务
let app = express();

//Mock随机类
const Random = Mock.Random;
//随机中文标题
Random.ctitle();
//app.use()  中间件,代表接受所有请求
//使用cors 解决跨域
app.use((req,res,next)=>{
    //设置响应头:将来作为响应式数据返回给客户端
    res.set("Access-Control-Allow-Origin","*");
    res.set("Access-Control-Allow-Headers","content-type,token");
    res.set("Access-Control-Allow-Methodes","GET,POST,PUT,DELETE");
    next();//触发下一个组件/路由
})
//创建路由
/**
 * request : 请求对象,客户端发给服务器的数据
 * response: 响应对象,服务器返回给客户端的数据
 */

 // 二级分类数据
/*
  问题：请求进不来
    请求地址：
      /admin/edu/subject/1/10 --> 请求一级分类数据
      /admin/edu/subject/get/1 --> 请求二级分类数据
      以上两个地址都会命中：/admin/edu/subject/:page/:limit 后面路由就不会执行
      所以请求进不来
  解决：必须放前面

*/
app.get("/admin/edu/subject/get/:parentId",(request,response,next)=>{
  //获取请求参数params
  const{parentId} = request.params
  //某个范围内随意一个整数
  const total = Random.integer(1,5)
  //模拟数据
  const data = Mock.mock({
    total,
    [`items|${total}`]:[
      {"_id|+1":100,
        title:"@ctitle(2,5)",
        parentId,
      }
    ]
  })
  if(total===1){
    data.items=[data.items];
  }
  response.json({
    code:20000,//成功状态码
    success:true,//成功
    data,
    message:"",
  })
})
app.get('/admin/edu/subject/:page/:limit',(request,response,next)=>{
    //取出请求体对象当中的params参数当中的当前页数 page 和每页的数量 limit
    const {page,limit} = request.params;
    //利用mick模拟数据
    /*
    一级分类
    {
      _id: 1, // 自己分类id
      title: '前端', // 课程分类名称
      parentId: 0 // 父级分类Id，如果是0就是1级分类
    }
    二级分类
    {
      _id: 2, // 自己分类id
      title: 'HTML', // 课程分类名称
      parentId: 1 // 父级分类Id，如果是0就是1级分类, 不是就是二级分类
    }
  */

    const data = Mock.mock({
        //以某个的范围取一个随机整数,此处根据每页数量决定范围(大一每页数量,但是小于它的二部)
        total:Random.integer(limit,limit*2),
        [`items|${limit}`]:[
            {
                //属性_id,初始值+1,遍历会递增
                "_id|+1":1,
                //@ctile 使用上边的Random.ctitle() 来生成随机标题,里边参数代表标题长度
                title:"@ctitle(2,5)",
                parentId:0,//代表一级菜单
            }
        ]
    })
    //将数据转化为json字符串返回响应
    response.json({
        code:20000,//成功状态码
        success:true,//成功状态
        data,//成功发响应体数据
        message:"",//失败的原因
    })
})
//开启端口监听
app.listen(8000,()=>{
console.log('8000端口启动~');
})