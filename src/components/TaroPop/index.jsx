import Taro from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import classNames from 'classnames'
import './index.less'
import { forwardRef, useState } from 'react'

let toastIcon = {
  // loading: require('./skin/loading.png'),
  // success: require('./skin/success.png'),
  // error: require('./skin/error.png'),
  // info: require('./skin/info.png')
}

let taroEnv = process.env.TARO_ENV

// let timer = null
const TaroPop = (props, ref) => {

  console.log('popup props:', props)
  // const [state, setState] = useState({
  //   shadeClose: true
  // })
  /**
   * @ 显示弹窗事件
   */
  // const show = options => {
  //   setState({
  //     ...props,
  //     ...options,
  //     isVisible: true
  //   })
  // }

  /**
   * @ 关闭弹窗事件
   */
  const close = () => {

    // timer && clearTimeout(timer)
    // timer = null
    typeof props.onClose === 'function' && props.onClose.call(null)
  }

  /**
   * @ 点击遮罩关闭
   */
  const shadeClick = () => {
    if (!props.shadeClose) return
    close()
  }

  // 渲染H5、RN模板
  const renderTpl = (
    <View className='taroPop'>
      {/* 遮罩 */}
      {props.shade ? (
        <View
          className='popup__ui_mask'
          style={{ opacity: props.opacity == '' ? 0.6 : props.opacity }}
          onClick={shadeClick}
        />
      ) : null}
      {/* 窗体 */}
      <View className='popup__ui_main'>
        <View
          className={classNames(
            'popup__ui_child',
            props.skin && 'popup__' + props.skin,
            props.position && 'popup__ui_child-' + props.position
          )}
          style={props.style}>
          {/* 标题 */}
          {props.title ? (
            <Text className={classNames('popup__ui_title', props.skin && 'popup__ui_title-' + props.skin)}>
              {props.title}
            </Text>
          ) : null}
          {/* 内容 */}
          <View className='popup__ui_content' style={props.contentStyle}>
            {props.content || props.children}
          </View>
          {
            // props.content ? (
            //   <View className='popup__ui_content'>
            //     {/* toast内容 */}
            //     {props.icon && props.skin === 'toast' ? (
            //       <View className='popup__ui_toast'>
            //         <Image
            //           className={classNames(
            //             'popup__ui_toast-img',
            //             props.icon == 'loading' && 'popup__ui_toast-img-loading'
            //           )}
            //           src={toastIcon[props.icon]}
            //           mode='aspectFit'
            //         />
            //       </View>
            //     ) : null}
            //     {/* 文本内容 */}
            //     <View
            //       className={classNames('popup__ui_cntxt', props.skin && 'popup__ui_cntxt-' + props.skin)}
            //       style={props.contentStyle}>
            //       {props.content}
            //     </View>
            //   </View>
            // ) : (
            //   props.children
            // )
          }
          {/* 按钮 */}
          {props.btns ? (
            <View className={classNames('popup__ui_footer', props.skin && 'popup__ui_footer-' + props.skin)}>
              {props.btns.map((item, i) => {
                return (
                  <View
                    className={classNames('popup__ui_btn', props.skin && 'popup__ui_btn-' + props.skin)}
                    key={i}
                    onClick={item.onClick}>
                    <Text
                      className={classNames('popup__ui_btntxt', props.skin && 'popup__ui_btntxt-' + props.skin)}
                      style={item.style}>
                      {item.text}
                    </Text>
                  </View>
                )
              })}
            </View>
          ) : null}
        </View>
        {/* xclose */}
        {props.xclose ? (
          <View className='popup__ui_icon-close' onClick={close}>
            {/* <Image
              className='popup__ui_xclose-img'
              src={require('./skin/error.png')}
              mode='aspectFit'
            /> */}
            error
          </View>
        ) : null}
      </View>
    </View>
  )

  // 渲染窗体
  if (taroEnv === 'rn') {
    // return (
    //   <Modal transparent={true} visible={isVisible} onRequestClose={this.close}>
    //     {renderTpl}
    //   </Modal>
    // )
  } else if (taroEnv === 'h5' || taroEnv === 'weapp') {
    return props.isVisible && renderTpl
  }
}

// 弹窗默认配置
TaroPop.defaultProps = {
  isVisible: false, //弹窗显示

  title: '', //标题
  content: '', //内容
  contentStyle: null, //内容样式
  style: null, //自定义弹窗样式
  skin: '', //弹窗风格
  icon: '', //弹窗图标
  xclose: false, //自定义关闭按钮

  shade: true, //遮罩层
  shadeClose: true, //点击遮罩关闭
  opacity: '', //遮罩透明度
  time: 0, //自动关闭时间
  onClose: null, //销毁弹窗回调函数

  anim: 'scaleIn', //弹窗动画
  position: '', //弹窗位置显示

  btns: null //弹窗按钮 [{...args}, {...args}]
}

export default forwardRef(TaroPop)
