import sensors from 'sa-sdk-javascript';

// const envs = ['dev','test', 'production'];

// if (envs.includes(process.env.NODE_ENV)) {
sensors.init({
  server_url: process.env.VUE_APP_SENSORS_SERVERURL,
  // heatmap_url神策分析中点击分析及触达分析功能代码，代码生成工具会自动生成。如果神策代码中 `sensorsdata.min.js` 版本是 1.13.1 及以前版本，这个参数须配置，高于此版本不需要配置。
  // heatmap_url: process.env.VUE_APP_SENSORS_HEATMAPURL,
  // web_url 神策分析中点击分析及触达分析功能会用到此地址，代码生成工具会自动生成。如果神策后台版本及 `sensorsdata.min.js` 均是 1.10 及以上版本，这个参数不需要配置。
  // web_url: '神策分析后台地址',
  // is_track_single_page:true,
  heatmap: {
    // 是否开启点击图，默认 default 表示开启，自动采集 $WebClick 事件，可以设置 'not_collect' 表示关闭
    // 需要 JSSDK 版本号大于 1.7
    clickmap: 'default',
    // 是否开启触达注意力图，默认 default 表示开启，自动采集 $WebStay 事件，可以设置 'not_collect' 表示关闭
    // 需要 JSSDK 版本号大于 1.9.1
    scroll_notice_map: 'default',
    // 设置触达图的有效停留时间，默认超过 4 秒以上算有效停留
    scroll_delay_time: 4000,
  },
  show_log: process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'dev', // 关闭控制台日志输出
  // SDK版本1.12.18以上支持，默认值为false
  is_track_single_page: true,
  // 注意默认的： sa.quick('autoTrack') 是需要的
});
sensors.quick('autoTrack');
// }

export default sensors;
