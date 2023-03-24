/*
 * @Date: 2022-07-21 13:28:05
 * @LastEditors: hookehuyr hookehuyr@gmail.com
 * @LastEditTime: 2022-08-22 09:51:52
 * @FilePath: /front/src/hooks/useGo.js
 * @Description: 文件描述
 */
import { useRouter } from 'vue-router';
import { getArticleAPI } from '@/api'
import { Cookies } from '@/utils/generatePackage'
import { parseQueryString } from '@/utils/tools'

/**
 * 封装路由跳转方便行内调用
 * @returns
 */
export function useGo () {
  let router = useRouter()
  function go (path, query) {
    router.push({
      path: path,
      query: query
    })
  }
  return go
}

/**
 * 封装跳转文章详情页
 * @param id 文章ID
 * @param cid 栏目ID
 * @param column 栏目名称
 * @param section 二级栏目名称
 * @param name 子栏目名称
 * @returns
 */
export function useGoTo () {
  let router = useRouter()
  // function detail({ id, cid, column, section, name, post_link }) {
  function detail(item) {
    // 保存点击位置
    // Cookies.set('scrollTop', getScrollTop());
    // Cookies.set('scrollTopId', id);
    // 判断是否跳转URL
    // const { code, data } = await getArticleAPI({ f: 'article', i: id, cid });
    // if (code) {
    //   if (data.post_link) { // 优先显示链接文章
    //     location.href = data.post_link;
    //     return false;
    //   }
    //   router.push({
    //     path: '/detail',
    //     query: { cid, id, column, section, name }
    //   });
    // }
    if (item) {
      if (item.post_link) {
        if (item.post_link.indexOf('f/guanzong/web')) {
          item.post_link = item.post_link.replace('web', 'front');
        }
        if (item.post_link.indexOf('f/guanzong/web/#/list') > 0 || item.post_link.indexOf('f/guanzong/front/#/list') > 0) {
          router.push({
            path: '/list',
            query: parseQueryString(item.post_link)
          });
          return false;
        } else if (item.post_link) { // 优先显示链接文章
          location.href = item.post_link;
          return false;
        }
      } else {
        router.push({
          path: '/detail',
          query: { cid: item.item, id: item.id, column: item.column, section: item.section, name: item.name }
        });
      }
    }
  }
  return detail
}

export function useReplace () {
  let router = useRouter()
  function replace (path, query) {
    router.replace({
      path: path,
      query: query
    })
  }
  return replace
}

export function getScrollTop () {
  var scroll_top = 0;
  if (document.documentElement && document.documentElement.scrollTop) {
    scroll_top = document.documentElement.scrollTop;
  }
  else if (document.body) {
    scroll_top = document.body.scrollTop;
  }
  return scroll_top;
}
