const { getCurrentDateHour } = require('./src/utils/commonJS.utils');
const argv = require('yargs').argv;
const IS_PROD = ['production'].includes(process.env.NODE_ENV);

/*
 * cdn引入
 * 集团中台passport sdk
 */
// const passport = process.env.VUE_APP_PASSPORT_SDK;
const cdn = {
  css: [],
  // js: [`${passport}?_t=${getCurrentDateHour()}`],
  js: [],
};

module.exports = {
  publicPath: process.env.VUE_APP_PUBLIC_PATH,
  outputDir: 'wukong-pay', // 'dist', 生产环境构建文件的目录
  lintOnSave: false,
  productionSourceMap: !IS_PROD, // 生产环境的 source map
  parallel: require('os').cpus().length > 1,
  devServer: {
    host: '0.0.0.0',
    disableHostCheck: true,
  },
  css: {
    modules: false,
    extract: IS_PROD,
    sourceMap: false,
    loaderOptions: {},
  },
  configureWebpack: {
    externals: { TAL_UC: 'window.TAL_UC' },
    resolve: {
      extensions: ['.js', '.vue', '.json'],
      alias: {
        '@': resolve('src'),
        assets: resolve('src/assets'),
        css: resolve('src/assets/css'),
        images: resolve('src/assets/images'),
        views: resolve('src/views'),
        components: resolve('src/components'),
        api: resolve('src/api'),
        mixins: resolve('src/mixins'),
        store: resolve('src/store'),
        sdk: resolve('src/sdk'),
      },
    },
  },
  chainWebpack: config => {
    /*
     * 配置懒路由
     * config.plugins.delete('preload'); // TODO: need test
     */
    config.plugins.delete('prefetch');

    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true;
        return options;
      })
      .end();

    config.plugin('define').tap(args => {
      args[0]['process.env'].BASE_URL = JSON.stringify(process.env.BASE_URL);
      args[0]['process.env'].NODE_ENV = JSON.stringify(process.env.NODE_ENV);
      return args;
    });

    // htmlWebpackPlugin 挂载到cdn
    config.plugin('html').tap(args => {
      args[0].cdn = cdn;
      return args;
    });

    //

    config.optimization.splitChunks({
      cacheGroups: {
        vendors: {
          name: 'chunk-vendors',
          test: /[\\/]node_modules[\\/]/,
          chunks: 'initial',
          priority: 2,
          reuseExistingChunk: true,
          enforce: true,
        },
        utils: {
          name: 'chunk-utils',
          test: /[\\/]node_modules[\\/](lodash|sa-sdk-javascript|alife-logger)[\\/]/,
          chunks: 'all',
          priority: 3,
          reuseExistingChunk: true,
          enforce: true,
        },
        vue: {
          name: 'chunk-vue',
          test: /[\\/]node_modules[\\/](vue|vuex|vue-router|axios|vue|vant)[\\/]/,
          chunks: 'all',
          priority: 4,
          reuseExistingChunk: true,
          enforce: true,
        },
      },
    });

    if (process.env.npm_config_vconsole) {
      enabledVConsole(config);
    }

    if (IS_PROD) {
      config.output.filename('[name].[chunkhash:8].js').end();
    }

    // 开启gzip(预加载打包时去掉gzip压缩)
    if (!argv.dir) {
      enabledGzip(config);
    }
    if (process.env.npm_config_report) {
      return enabledAnalyz(config);
    }
  },
};

function resolve(dir) {
  return require('path').resolve(__dirname, dir);
}

function enabledVConsole(config) {
  const vConsolePlugin = require('vconsole-webpack-plugin');
  const pligun = new vConsolePlugin({ enable: true });
  config.plugin('vconsole-webpack-plugin').use(pligun);
}

function enabledGzip(config) {
  config
    .plugin('compression')
    .use(require('compression-webpack-plugin'), {
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(`\\.(${['js', 'css'].join('|')})$`),
      threshold: 10240,
      minRatio: 0.8,
      cache: true,
    })
    .tap(args => { });
}

function enabledAnalyz(config) {
  config
    .plugin('webpack-bundle-analyzer')
    .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin);
}
