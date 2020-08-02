import sensors from '@/sdk/sensors';
import { getPlatform } from '@/utils/platformHelper';

const userId = localStorage.getItem('userId');

const common = {
  stu_id: userId || '',
  event_belong: getPlatform() === 'app' ? '小猴思维app' : '小猴思维服务号',
  event_time: new Date(),
  subject_belong: '思维'
};

/**
 * 1、填写地址页_曝光
 * @param {Object} data
 */
export const sensorsFillinaddressShow = data => {
  const pre = {
    event_type: '页面',
    event_smalltype: '普通页面',
    event_name: 'fillinaddress_show',
    event_displayname: '填写地址页_曝光',
  };

  sensors.track('fillinaddress_show', {
    ...common,
    ...pre,
    ...data
  });
};

/**
 * 2、填写地址页_保存地址
 * @param {Object} data
 */
export const sensorsFillinaddressSave = data => {
  const pre = {
    event_type: '按钮',
    event_smalltype: '普通按钮',
    event_name: 'fillinaddress_save',
    event_displayname: '填写地址页_保存地址',
  };

  sensors.track('fillinaddress_save', { ...data, ...common, ...pre });
};
