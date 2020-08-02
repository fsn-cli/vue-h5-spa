
/**
 *
 */

window.mk = {
  default: this, // for typescript
  call(method, args, cb) {
    let ret = '';
    if (typeof args === 'function') { // 无参数有回调的情况
      cb = args;
      args = {};
    }
    let arg = { data: args === undefined ? null : args };
    if (typeof cb === 'function') {
      const cbName = `dscb${window.dscb++}`;// 将方法定义为一个全局变量，用于后面调用
      window[cbName] = cb;
      arg._dscbstub = cbName;// 将方法名保存到arg中，用于Native端调用
    }
    arg = JSON.stringify(arg);
    // if in webview that dsBridge provided, call!
    if (window._dsbridge) {
      ret = _dsbridge.call(method, arg);
    } else if (window._dswk || navigator.userAgent.indexOf('_dsbridge') != -1) { // 使用时Native会注册_dswk参数
      ret = prompt(`_dsbridge=${method}`, arg);// 调起原生代码(ios端会调用WKUIDelegate的方法)
    }

    return JSON.parse(ret || '{}').data;
  },
  cbs: [], // before bridge ready, callback list
  isBridgeReady: false, // before bridge ready, callback list
  // Native调用的方法使用此方法注册
  register(name, fun, asyn) {
    // 注册的方法会保存到_dsaf或_dsf中
    const q = asyn ? window._dsaf : window._dsf;
    if (!window._dsInit) {
      window._dsInit = true;
      // notify native that js apis register successfully on next event loop
      setTimeout(() => {
        mk.call('_dsb.dsinit');
      }, 0);
    }
    // object类型保存到_obs下，方法直接保存到_dsf(_dsaf)下
    if (typeof fun === 'object') {
      q._obs[name] = fun;
    } else {
      q[name] = fun;
    }
  },
  registerAsyn(name, fun) {
    this.register(name, fun, true);
  },
  hasNativeMethod(name, type) {
    return this.call('_dsb.hasNativeMethod', { name, type: type || 'all' });
  },
  disableJavascriptDialogBlock(disable) {
    this.call('_dsb.disableJavascriptDialogBlock', {
      disable: disable !== false,
    });
  },
  // /**
  //  * 生成一个不重复的方法 使用一次
  //  */
  // oneshotCallback = function (callback, title) {
  //     var randomFunctionName = title+ "_ONESHOT_" + uuidv4() + "_";
  //     randomFunctionName = randomFunctionName.replace(/-/g, '_');

  //     global[randomFunctionName] = function (content) {
  //       callback(content);
  //       delete global[randomFunctionName];
  //     }
  //     return randomFunctionName;
  //   }
};

// 立即执行函数
!(function () {
  // 判断是否需要给window进行参数添加，如果没有添加会把ob内参数进行一次添加
  if (window._dsf) return;
  const ob = {
    _dsf: { // 存储同步方法
      _obs: {}, // 存储同步方法相关object
    },
    _dsaf: { // 存储异步方法
      _obs: {}, // 存储异步方法相关object
    },
    dscb: 0, // 避免方法同名每次加1
    dsBridge: mk,
    close() {
      mk.call('_dsb.closePage');
    },
    // 处理Native调用js方法
    _handleMessageFromNative(info) {
      const arg = JSON.parse(info.data);
      const ret = {
        id: info.callbackId,
        complete: true,
      };
      const f = this._dsf[info.method];
      const af = this._dsaf[info.method];
      const callSyn = function (f, ob) {
        ret.data = f.apply(ob, arg);
        bridge.call('_dsb.returnValue', ret);// js方法处理完后回调原生方法，并返回处理后的结果
      };
      const callAsyn = function (f, ob) {
        arg.push((data, complete) => {
          ret.data = data;
          ret.complete = complete !== false;
          bridge.call('_dsb.returnValue', ret);
        });
        f.apply(ob, arg);
      };
      if (f) {
        callSyn(f, this._dsf);
      } else if (af) {
        callAsyn(af, this._dsaf);
      } else {
        // with namespace
        const name = info.method.split('.');
        if (name.length < 2) return;
        const method = name.pop();
        const namespace = name.join('.');
        let obs = this._dsf._obs;
        let ob = obs[namespace] || {};
        let m = ob[method];
        if (m && typeof m === 'function') {
          callSyn(m, ob);
          return;
        }
        obs = this._dsaf._obs;
        ob = obs[namespace] || {};
        m = ob[method];
        if (m && typeof m === 'function') {
          callAsyn(m, ob);
        }
      }
    },
  };
  // 将ob所有参数赋值给window
  for (const attr in ob) {
    window[attr] = ob[attr];
  }
  mk.register('_hasJavascriptMethod', (method, tag) => {
    const name = method.split('.');
    if (name.length < 2) {
      return !!(_dsf[name] || _dsaf[name]);// js用!!进行bool转换
    }
    // with namespace
    var method = name.pop();
    const namespace = name.join('.');
    let ob = _dsf._obs[namespace] || _dsaf._obs[namespace];
    return ob && !!ob[method];
  });
}());

window.registerBridge = function () {
  // 全局 LogManager
  window.LogManager = {
  };
  // console.warn("registerBridge");
  window.mk.call('registerBridge', () => {
    window.mk.isBridgeReady = true;
    console.log('BridgeReady啦');
    if (window.mk.cbs && window.mk.cbs.length) {
      window.mk.cbs.forEach((cb) => {
        console.log('start to run callback');
        typeof cb === 'function' && cb();
      });
      window.mk.cbs = [];
    }
  });
  return window.mk;
};
window.registerBridge();

// var LogManager = {};
// mk.getLogManager = function(args, cb){
//     return LogManager;
// }
//
// LogManager.debug
// LogManager.warn
// LogManager.error
// LogManager.info

// var obj = mk.getLogManager();
// obj.debug({msg:"xxxxxx"})
