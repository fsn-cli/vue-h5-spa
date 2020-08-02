/**
 * @description 获取当前 年月日时
 * @author Yang Zekun <yangzekun@100tal.com>
 * @date 2019-10-20
 * @returns {string} 2019102012
 */
exports.getCurrentDateHour = function getCurrentDateHour () {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();

  return `${year}${month}${day}${hours}`;
};
