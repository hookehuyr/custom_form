/*
 * @Date: 2022-06-13 17:42:32
 * @LastEditors: hookehuyr hookehuyr@gmail.com
 * @LastEditTime: 2023-03-03 17:51:55
 * @FilePath: /data-table/src/composables/useShare.js
 * @Description: 文件描述
 */
import wx from 'weixin-js-sdk';
// import { Toast } from 'vant';

/**
 * @description: 微信分享功能
 * @param {*} title 标题
 * @param {*} desc 描述
 * @param {*} imgUrl 图标
 * @return {*}
 */
export const sharePage = ({title = '自定义表单', desc = '数据收集', imgUrl = ''}) => {
  const shareData = {
    title, // 分享标题
    desc, // 分享描述
    link: location.origin + location.pathname + location.hash, // 分享链接，该链接域名或路径必须与当前页面对应的公众号 JS 安全域名一致
    imgUrl, // 分享图标
    success: function () {
      console.warn('设置成功');
    }
  }
  // 分享好友（微信好友或qq好友）
  // wx.updateAppMessageShareData(shareData);
  wx.onMenuShareAppMessage(shareData);
  // 分享到朋友圈或qq空间
  // wx.updateTimelineShareData(shareData);
  wx.onMenuShareTimeline(shareData);
  // 分享到腾讯微博
  wx.onMenuShareWeibo(shareData);
  // // 获取“分享给朋友”按钮点击状态及自定义分享内容接口（即将废弃）
  // wx.onMenuShareAppMessage(shareData);
  // // 获取“分享到朋友圈”按钮点击状态及自定义分享内容接口（即将废弃）
  // wx.onMenuShareTimeline(shareData);
  // // 获取“分享到QQ”按钮点击状态及自定义分享内容接口（即将废弃）
  // wx.onMenuShareQQ(shareData);
}
