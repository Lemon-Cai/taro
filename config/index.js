/*
 * @Author: CaiPeng
 * @Date: 2022-09-14 15:37:31
 * @LastEditors: caipeng
 * @LastEditTime: 2023-02-09 10:36:29
 * @FilePath: \React\Taro\myTaroApp\config\index.js
 * @Description: 
 */
import path from 'path'

const config = {
  projectName: 'myTaroApp',
  date: '2022-9-14',
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  // 用于配置目录别名，从而方便书写代码引用路径。
  alias: {
    '@/components': path.resolve(__dirname, '..', 'src/components'),
    '@/assets': path.resolve(__dirname, '..', 'src/assets'),
    '@/utils': path.resolve(__dirname, '..', 'src/utils')
  },
  // 插件
  // plugins: [
  //   ['@tarojs/plugin-html', {
  //     pxtransformBlackList: [/am-/, /demo-/, /^body/]
  //   }]
  // ],
  plugins: ['@tarojs/plugin-html'],
  defineConstants: {},
  copy: {
    patterns: [],
    options: {}
  },
  // 框架，react，nerv，vue, vue3 等
  framework: 'react',
  compiler: 'webpack5',
  // compiler: {
  //   type: 'webpack5',
  //   prebundle: {
  //     // enable: process.env.NODE_ENV === 'development', // 默认值：生产环境为 false，开发环境为 true 是否开启依赖预编译
  //     // cacheDir: '', // 默认值：[项目路径]/node_modules/.taro , 缓存目录的绝对路径
  //   }
  // },
  cache: {
    enable: false // Webpack 持久化缓存配置，建议开启。默认配置请参考：https://docs.taro.zone/docs/config-detail#cache
  },
  // 日志信息
  // logger: {
  //   quiet: true,
  //   stats: false // 是否输出 Webpack Stats 信息
  // },
  mini: {
    postcss: {
      pxtransform: {
        enable: true,
        config: {
          onePxTransform: true, // 设置 1px 是否需要被转换
          unitPrecision: 5, // REM 单位允许的小数位。
          propList: ['*'], // 允许转换的属性。 * : 所有
          selectorBlackList: [], // 黑名单里的选择器将会被忽略。
          replace: true, // 直接替换而不是追加一条进行覆盖。
          mediaQuery: false, // 允许媒体查询里的 px 单位转换
          minPixelValue: 0 // 设置一个可被转换的最小 px 值
        }
      },
      // 小程序端样式引用本地资源内联配置
      url: {
        enable: true,
        config: {
          limit: 1024 // 设定转换尺寸上限
        }
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    },
    // 自定义 Webpack 配置
    webpackChain(chain, webpack) {
      chain.module
        .rule('script')
        .use('linariaLoader')
        .loader('@linaria/webpack-loader')
        .options({
          sourceMap: process.env.NODE_ENV !== 'production',
        })
    }
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    postcss: {
      autoprefixer: {
        enable: true,
        config: {}
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    },
    // 自定义 Webpack 配置
    webpackChain(chain, webpack) {
      chain.module
        .rule('script')
        .use('linariaLoader')
        .loader('@linaria/webpack-loader')
        .options({
          sourceMap: process.env.NODE_ENV !== 'production',
        })
    },
    // webpack 的 devServer 配置
    devServer: {
      port: 8899
    }
  },
  rn: {
    appName: 'taroDemo',
    postcss: {
      cssModules: {
        enable: false // 默认为 false，如需使用 css modules 功能，则设为 true
      }
    }
  }
}

module.exports = function(merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'))
  }
  return merge({}, config, require('./prod'))
}
