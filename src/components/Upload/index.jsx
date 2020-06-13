import React, { Component } from "react";
import {
  Button,
  // as 重命名
  Upload as AntdUpload,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
//引入七牛的SDK
import * as qiniu from "qiniu-js";
//用来生成唯一id
import { nanoid } from "nanoid";
//引入获取七牛凭证token 请求
import { reqGetUploadToken } from "@api/edu/upload";
//引入配置好的qinniu
import qiniuConfig from "@conf/qiniu";

//长传的文件大小
const MAX_VIDEO_SIZE = 35 * 1024 * 1024; // 35mb

export default class Upload extends Component {
  /**
   * 上传之前触发的函数
   * @param {*} file 当前上传的文件
   * @param {*} fileList 上传的文件列表（包含之前上传和当前上传~）
   * @return {Boolean|Promise} 返回值false/reject就终止上传，其他情况就继续上传
   */
  //从本地读取数据,并解析对象,因为token凭证是保存到本地的,上来要先检查本地是否存在
  getUploadToken = () => {
    try {
      //读取本地数据,并且解析成对象
      const { uploadToken, expires } = JSON.parse(
        localStorage.getItem("upload_token")
      );
      //读取到的话验证是否过期
      if (!this.isValidUploadToken(expires)) {
        throw new Error("uploadToken过期了");
      }
      return {
        uploadToken,
        expires,
      };
    } catch {
      return {
        uploadToken: "",
        expires: 0,
      };
    }
  };
  //初始化状态
  state = {
    ...this.getUploadToken(),
    isUploadSuccess: false,
  };
  //获取凭证
  fetchUploadToken = async () => {
    const { uploadToken, expires } = await reqGetUploadToken();
    console.log(uploadToken, expires);

    //保存凭证
    this.saveUploadToken(uploadToken, expires);
  };
  //判断UploadToken是否有效,返回值 true 有效 返回值 false有效
  isValidUploadToken = (expires) => {
    return expires > Date.now();
  };
  //保存 UploadToken
  saveUploadToken = (uploadToken, expires) => {
    const data = {
      uploadToken,
      //设置过期时间: 当前时间 + 7200 * 1000- 5*60*1000  提前五分钟刷新
      expires: Date.now() + expires * 1000 - 5 * 60 * 1000,
    };
    //跟新状态
    this.setState(data);
    //持久化储存
    localStorage.setItem("upload_token", JSON.stringify(data));
  };

  //上传前触发的函数
  beforeUpload = (file, fileList) => {
    /*
      上传视频前限制大小
    */
    return new Promise(async (resolve, reject) => {
      // console.log(file, fileList);
      if (file.size > MAX_VIDEO_SIZE) {
        message.warn("上传视频不能超过35mb");
        return reject(); // 终止上传
      }
      //上传前要检查凭证有没有过期,没有就直接用,过期了就重新请求.
      //注意新请求回来的,既要保存在state当中,也要存在localStorage当中
      const { expires } = this.state;
      if (!this.isValidUploadToken(expires)) {
        //过期就重新请求
        await this.fetchUploadToken();
      }
      // 文件大小OK
      resolve(file); // file就会作为要上传的文件，进行上传~
    });
  };

  // 自定义上传视频方案
  customRequest = ({ file, onProgress, onSuccess, onError }) => {
    //获取 uploadToken 凭证
    const { uploadToken } = this.state;
    console.log(uploadToken);
    //生成随机的key ,长度为10的随机id.而且id是唯一的
    const key = nanoid(10);
    const putExtra = {
      fname: "", //文件原名称
      //params:{},//用来放置自定义变量
      mimieType: ["video/mp4"], //
    };
    //当前对象存储库位于的区域
    const config = {
      region: qiniuConfig.region, //华北区域
    };

    //创建上传文件对象
    const observable = qiniu.upload(
      file, //上传的文件
      key, //上传文件的新命名,保证唯一性
      uploadToken, //上传凭证
      putExtra,
      config
    );
    //上传过程中触发的回调函数对象
    const observer = {
      next(res) {
        //上传过程中触发的的回调函数
        //上传总进度,小数点去两位
        const percent = res.total.percent.toFixed(2);
        //更新上次的进度
        onProgress({ percent }, file);
      },
      error(err) {
        //上传失败触发的回调函数
        onError(err);
        message.error("上传视频失败");
      },
      complete: (res) => {
        //上传成功触发的回调函数,取消进度条
        onSuccess(res);
        console.log(res);
        const video = qiniuConfig.prefix_url + res.key;
        //inchange是from.item传入的,当调用传入值时,这个值就会被Form收集
        this.props.onChange(video);
        //上传成功,便把按钮隐藏
        this.setState({
          isUploadSuccess: true,
        });
        {
          message.success("上传成功");
        }
      },
    };
    //开始上传
    this.subscription = observable.subscribe(observer);
  };

  componentWillUnmount() {
    //组件 结束时取消上传      //如果没有上传过, 值为undefined,此时不需要上传
    this.subscription && this.subscription.unsubscribe();
  }
  //取消上传的视频时触发的回调
  remove = () => {
    //取消上传
    this.subscription.unsubscribe();
    //返回值也应该重置
    this.props.onChange("");
    //显示按钮
    this.setState({
      isUploadSuccess: false,
    });
  };
  render() {
    const { isUploadSuccess } = this.state;
    return (
      <AntdUpload
        className="upload"
        accept="video/mp4"
        listType="picture"
        beforeUpload={this.beforeUpload}
        customRequest={this.customRequest}
        onRemove={this.remove}
      >
        {isUploadSuccess ? null : (
          <Button>
            <UploadOutlined /> 上传视频
          </Button>
        )}
      </AntdUpload>
    );
  }
}
