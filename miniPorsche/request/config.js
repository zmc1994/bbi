let Fly = require("./wx.umd.min.js");
let fly = new Fly();
fly.config.baseURL="https://way.jd.com/jisuapi";
module.exports={
  fly:fly,
  baseUrl:fly.config.baseURL
}