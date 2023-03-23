import VConsole from 'vconsole';

// const vConsole = new VConsole();
let vConsole = '';
// 或者使用配置参数来初始化，详情见文档
if (+import.meta.env.VITE_CONSOLE) {
  vConsole = new VConsole({ theme: 'dark' });
}

export default vConsole
