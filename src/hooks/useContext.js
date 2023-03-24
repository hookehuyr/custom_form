import { provide, inject } from "vue";

// const key = Symbol();

/**
 * 创建全局变量
 * @param {*} context 
 * @param {*} key 
 */
export function createContext(context, key) {
  provide(key, context)
}
/**
 * 使用全局变量
 * @param {*} key 
 * @returns 
 */
export function useContext(key) {
  return inject(key)
}
