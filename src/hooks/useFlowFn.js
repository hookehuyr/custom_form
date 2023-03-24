
/**
 * @description 封装简化滚动查询列表执行流程
 * @param {*} data 接口返回列表数据
 * @param {*} list 自定义列表
 * @param {*} offset 
 * @param {*} loading 
 * @param {*} finished 
 * @param {*} finishedTextStatus 
 * @param {*} emptyStatus 
 */
import _ from 'lodash'

export const flowFn = (data, list, offset, loading, finished, finishedTextStatus, emptyStatus) => {
  list.value = _.concat(list.value, data);
  list.value = _.uniqBy(list.value, 'id');
  offset.value = list.value.length;
  loading.value = false;
  // 数据全部加载完成
  if (!data.length) {
    // 加载状态结束
    finished.value = true;
  }
  // 空数据提示
  if (!list.value.length) {
    finishedTextStatus.value = false;
  }
  emptyStatus.value = Object.is(list.value.length, 0);
}
