/*
 * @Author: hookehuyr hookehuyr@gmail.com
 * @Date: 2022-06-09 13:32:44
 * @LastEditors: hookehuyr hookehuyr@gmail.com
 * @LastEditTime: 2022-06-09 13:42:06
 * @FilePath: /tswj/src/api/wx/config.js
 * @Description:
 */
import { fn, fetch } from '@/api/fn';

const Api = {
  WX_PAY: 'c/bill_paymentForBill.do',
}

/**
 * @description 微信支付接口
 * @param {*}
 * @returns {*}
 */
export const wxPayAPI = (params) => fn(fetch.get(Api.WX_PAY, params));
