import { mainStore } from '@/utils/generatePackage.js'

// 删除 keep-alive 缓存
export const store = mainStore();

export const killPages = () => {
  store.changeKeepPages();
}

export const addPages = () => {
  store.keepThisPage();
}
