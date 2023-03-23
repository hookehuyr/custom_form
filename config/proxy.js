export function createProxy(prefix, target) {
  const ret = {};
  ret[prefix] = {
    target,
    changeOrigin: true,
    ws: true,
    // rewrite: (path) => path.replace(/^\/api/, '')
    // rewrite: (path) => path.replace(new RegExp(`^${prefix}`), ''),
  }
  return ret
}
