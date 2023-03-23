/*
 * @Date: 2022-05-17 11:26:03
 * @LastEditors: hookehuyr hookehuyr@gmail.com
 * @LastEditTime: 2022-08-05 15:18:06
 * @FilePath: /front/src/utils/generatePackage.js
 * @Description: 文件描述
 */
import Cookies from 'js-cookie'
import $ from 'jquery'
import _ from 'lodash'
import dayjs from 'dayjs'
import axios from '@/utils/axios';
import { storeToRefs } from 'pinia'
import { mainStore } from '@/store'
import { Toast, Dialog } from 'vant';
import { wxInfo, hasEllipsis } from '@/utils/tools';
import { useTitle } from '@vueuse/core'

export {
  Cookies,
  $,
  _,
  axios,
  storeToRefs,
  mainStore,
  Toast,
  Dialog,
  wxInfo,
  hasEllipsis,
  useTitle,
  dayjs
}
