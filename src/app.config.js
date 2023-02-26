/*
 * @Author: CaiPeng
 * @Date: 2022-09-14 15:37:31
 * @LastEditors: caipeng
 * @LastEditTime: 2023-02-09 13:09:34
 * @FilePath: \React\Taro\myTaroApp\src\app.config.js
 * @Description:
 */
export default defineAppConfig({
  pages: ['pages/home/index', 'pages/report/index', 'pages/mine/index'],
  window: {
    navigationBarBackgroundColor: '#ffffff',
    navigationBarTextStyle: 'black',
    navigationBarTitleText: '微信接口功能演示',
    backgroundColor: '#eeeeee',
    backgroundTextStyle: 'light'
  },
  tabBar: {
    color: '#333333', // 必填 tab 上的文字默认颜色，仅支持十六进制颜色
    selectedColor: '#0581E5', // 必填 tab 上的文字选中时的颜色
    backgroundColor: '#ffffff', // 必填 tab 的背景色
    borderStyle: 'white', // tabbar 上边框的颜色， 仅支持 black / white
    list: [
      {
        pagePath: 'pages/home/index', // 路径
        text: '首页', // tabBar 文字
        iconPath: './assets/tabBar/home.png', // tabBar 的 图标
        selectedIconPath: './assets/tabBar/home-active.png' // 选中时 icon 的路径 icon 大小限制为40kb，建议尺寸为 81px * 81px ，不支持网络图片。 当 position 为 top 时，不显示 icon。
      },
      {
        pagePath: 'pages/report/index', // 路径
        text: '报表', // tabBar 文字
        iconPath: './assets/tabBar/report.png', // tabBar 的 图标
        selectedIconPath: './assets/tabBar/report-active.png' // 选中时 icon 的路径 icon 大小限制为40kb，建议尺寸为 81px * 81px ，不支持网络图片。 当 position 为 top 时，不显示 icon。
      },
      {
        pagePath: 'pages/mine/index', // 路径
        text: '我的', // tabBar 文字
        iconPath: './assets/tabBar/mine.png', // tabBar 的 图标
        selectedIconPath: './assets/tabBar/mine-active.png' // 选中时 icon 的路径 icon 大小限制为40kb，建议尺寸为 81px * 81px ，不支持网络图片。 当 position 为 top 时，不显示 icon。
      }
    ],
    position: 'bottom', // tabBar的位置，仅支持 bottom / top
    custom: false // 自定义 tabBar
  },
  subPackages: [
    {
      "root": "pages/subPages/",
      pages: [
        "analysis/index",
        "degreeOfDiligence/index",
      ]
    }
  ],
  // 微信小程序专有配置
  permission: {}
  // 胶囊按钮里面的部分菜单可通过配置开关来显示隐藏
  // quickMenu: {
  //   share: false, // 是否显示推送给朋友（分享）菜单
  //   favorite: false, // 是否显示关注菜单
  //   sendToDesktop: false // 是否显示发送到桌面菜单，仅安卓有效
  // }
})
