const { fly } = require("../../request/config.js");
const req = require("../../request/config.js");
const app = getApp();
Page({
  data:{
    phoneNum:"",
    location:"",
    userInfo:{},
    hasUserInfo:false
  },
  onLoad(){
    
  },
  getUserInfo:function(e){
    console.log(e);
    this.setData({
      userInfo:e.detail.userInfo,
      hasUserInfo:true
    })
  },
  getvalue:function(e){
    let value = e.detail.value;
    console.log(value);
    this.setData({
      phoneNum:value
    })
  },
  bindViewTap: function(e) {
    let phone = this.data.phoneNum;
    var _this = this;
    if(!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(phone))){
      console.log("手机号错误"+phone)
      return;
    };
    fly.get("/query4?appkey=29d82b6b720ea97547498f7bb87f4c2c&shouji="+phone)
    .then(function(res){
      console.log(res);
      _this.setData({
        location:res.data.result.result.city
      })
    })
    .catch(function(err){
      console.log(err);
    })
  },
  scanCode:function(){
    wx.scanCode({
      onlyFromCamera: true,
      success(res){
        wx.showModal({
          content: res.result
        })
      }
    })
  }
})
