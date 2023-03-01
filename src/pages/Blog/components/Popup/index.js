// import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import classNames from 'classnames'
import { forwardRef, useState, useEffect, useImperativeHandle } from 'react'
import './index.less'

const Popup = (props, ref) => {
  const [state, setState] = useState({
    innerShow: false,
    wrapperShow: false
  })

  useImperativeHandle(ref, () => ({}))

  useEffect(() => {
    if (props.show) {
      setState({
        innerShow: true,
        wrapperShow: true
      })
    } else {
      setState({
        innerShow: false
      })
      requestAnimationFrame(() => {
        setState({
          innerShow: false,
          wrapperShow: false
        })
      })
    }
  }, [props.show])

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
  const handleClickMask = () => {
    if (!props.maskClosable) return
    close()
  }

  return (
    state.wrapperShow && (
      <View aria-role='dialog' aria-modal='true' style={props.style}>
        {props.mask && (
          <View
            className={classNames(
              'weui-mask',
              state.innerShow ? 'weui-animate-fade-in' : 'weui-animate-fade-out'
            )}
            onClick={handleClickMask}
            onTouchmove={props.onMaskMouseMove}
          ></View>
        )}

        <View
          className={classNames(
            'weui-half-screen-dialog',
            state.innerShow ? 'weui-animate-slide-up' : 'weui-animate-slide-down',
            props.className
          )}
          onTouchmove={props.onMaskMouseMove}
          style={props.contentStyle}
        >
          {props.title && <View class='weui-half-screen-dialog__hd'>
            <View class='weui-half-screen-dialog__hd__main' tabindex='0'>
              <View class='weui-half-screen-dialog__title'>{props.title}</View>
            </View>
          </View>}
          <View class='weui-half-screen-dialog__bd'>{props.content || props.children}</View>
          {props.footer && (
            <View class='weui-half-screen-dialog__ft'>
              <View class='weui-half-screen-dialog__btn-area'>{props.footer}</View>
            </View>
          )}
        </View>
      </View>
    )
  )
}

// 弹窗默认配置
Popup.defaultProps = {
  show: false, //弹窗显示

  title: '', //标题
  content: '', //内容
  contentStyle: null, //内容样式
  style: null, //自定义弹窗样式

  mask: true, //遮罩层
  maskClosable: true, //点击遮罩关闭

  onClose: null, //销毁弹窗回调函数
  onMaskMouseMove: null
}

export default forwardRef(Popup)
