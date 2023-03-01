import Taro from '@tarojs/taro'
import { Button, Text, View } from "@tarojs/components"
import classNames from "classnames"

import Popup from "../Popup"

import './index.less'

const Share = ({
  show,
  showCancel = true,
  headerText = '分享到',
  cancelText = '取消',
  config = {},
  contentStyle,

  onToggle
}) => {

  const handleClickItem = (type) => {
    // if (type === 'wechat') {
    //   Taro.showShareMenu({
    //     withShareTicket: true,
    //     showShareItems: ['shareAppMessage']
    //   })
    // } else if (type === 'wework') {
    //   Taro.showShareMenu({
    //     withShareTicket: true,
    //     showShareItems: ['shareAppMessage']
    //   })
    // } else if (type === 'moments') {
    //   Taro.showShareMenu({
    //     withShareTicket: true,
    //     showShareItems: ['shareTimeline'],
    //     success: (res) => {
    //       console.log('shareTimeline', res)
    //     }
    //   })
    // }

    if (type === 'wechat') {
      // eslint-disable-next-line no-undef
      wx?.invoke('shareWechatMessage', config, function (res) {
        if (res.err_msg === 'shareWechatMessage:ok') {
          handleClickCancel()
        }
      })
    } else if (type === 'wework') {
      // eslint-disable-next-line no-undef
      wx?.invoke('shareAppMessage', config, function (res) {
        if (res.err_msg === 'shareAppMessage:ok') {
          handleClickCancel()
        }
      })
    } else if (type === 'moments') {
      // eslint-disable-next-line no-undef
      // wx?.invoke('shareTimeline', config, function (res) {
      //   if (res.err_msg === 'shareTimeline:ok') {
      //     handleClickCancel()
      //   }
      // })
      Taro.showShareMenu({
        withShareTicket: true,
        showShareItems: ['shareTimeline'],
        success: (res) => {
          console.log('shareTimeline', res)
        }
      })
    }
  }
  const handleToggle = () => {
    onToggle?.()
  }
  const handleClickCancel = () => {
    onToggle?.()
  }

  return (
    <Popup
      show={show}
      mask
      maskClosable
      title={
        (
          <View className="wq-share-hd">
            {headerText}
          </View>
        )
      }
      onClose={handleToggle}
      contentStyle={{
        paddingLeft: 0,
        paddingRight: 0,
        borderRadius: 0,
        minHeight: '50px',
        maxHeight: '50%',
        overflow: 'hidden',
        background: '#ffffff',
        ...contentStyle
      }}
      footer={
        showCancel ? (
          <View className="wq-share-ft" onClick={handleClickCancel}>
            { cancelText }
          </View>
        ) : null
      }
    >
      <View className={classNames("wq-share", {'wq-share-toggle': show})}>
        <View className="wq-share-bd">
          <Button plain open-type="share" data-type="wechat">
            <View className="wq-share-item" onClick={() => handleClickItem('wechat')}>
              <View className="wq-share-icon wechat" />
              <Text className="wq-share-text">微信好友</Text>
            </View>
          </Button>
          <Button plain open-type="share" data-type="wework">
            <View className="wq-share-item" onClick={() => handleClickItem('wework')}>
              <View className="wq-share-icon wework" />
              <Text className="wq-share-text">企业微信好友</Text>
            </View>
          </Button>
          
          <Button plain open-type="share" data-type="moments">
            <View className="wq-share-item" open-type="share" onClick={() => handleClickItem('moments')}>
              <View className="wq-share-icon moments" />
              <Text className="wq-share-text">微信朋友圈</Text>
            </View>
          </Button>
        </View>
      </View>
    </Popup>
  )
}

export default Share