const formatStatus = status => {
  let sStatus = '';
  switch (status) {
    case 1:
      sStatus = '待发货';
      break;
    case 2:
      sStatus = '待发货';
      break;
    case 3:
      sStatus = '已发货';
      break;
    case 4:
      sStatus = '已签收';
      break;
    default:
      break;
  }

  return sStatus;
};

const formatPhone = phone => {
  return phone.replace(/^(.{3})(.*)(.{4})$/, '$1 $2 $3');
};
export { formatStatus, formatPhone };
