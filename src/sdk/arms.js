/**
 * 阿里前端监控
 * 配置文档 https://www.npmjs.com/package/alife-logger
 */
import BrowerLogger from 'alife-logger';
const logger = (() => {
  if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test') {
    try {
      return BrowerLogger.singleton({
        pid: process.env.VUE_APP_ARMS_PID, // 这是项目ID，新建一个应用站点后自动生成，在单个应用站点内部的`设置->应用设置`查看
        imgUrl: process.env.VUE_APP_ARMS_IMGURL, // 日志上传地址，源码中默认值就是这个地址
        enableSPA: true, // 是否监听页面的 hashchange 事件并重新上报 PV，适用于单页面应用场景
        sendResource: true, // 是否上报资源数据
        appType: 'web', // 网站类型，web，小程序等
        enableLinkTrace: true,
        behavior: true,
        useFmp: true,
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('init logger fail', e);
    }
  } else {
    return {
      error() { },
    };
  }
})();

export default logger;
