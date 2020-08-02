import { toLogin } from 'api/login/h5login';
import { getLocalToken } from '@/utils/local';

export function isLogin () {
  const token = getLocalToken();

  if (token) {
    return true;
  } else {
    toLogin();
    return false;
  }
}
