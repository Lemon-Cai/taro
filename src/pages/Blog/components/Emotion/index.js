import { useState } from 'react'
import { Swiper, SwiperItem, Image, View } from '@tarojs/components'
import _chunk from 'lodash/chunk'

import './index.less'

export const fullEmotions = [
  '[微笑]',
  '[撇嘴]',
  '[色]',
  '[发呆]',
  '[得意]',
  '[流泪]',
  '[害羞]',
  '[闭嘴]',
  '[睡]',
  '[大哭]',
  '[尴尬]',
  '[发怒]',
  '[调皮]',
  '[呲牙]',
  '[惊讶]',
  '[难过]',
  '[酷]',
  '[冷汗]',
  '[抓狂]',
  '[吐]',
  '[偷笑]',
  '[可爱]',
  '[白眼]',
  '[傲慢]',
  '[饥饿]',
  '[困]',
  '[惊恐]',
  '[流汗]',
  '[憨笑]',
  '[大兵]',
  '[奋斗]',
  '[咒骂]',
  '[疑问]',
  '[嘘]',
  '[晕]',
  '[折磨]',
  '[衰]',
  '[骷髅]',
  '[敲打]',
  '[再见]',
  '[擦汗]',
  '[抠鼻]',
  '[鼓掌]',
  '[糗大了]',
  '[坏笑]',
  '[左哼哼]',
  '[右哼哼]',
  '[哈欠]',
  '[鄙视]',
  '[委屈]',
  '[快哭了]',
  '[阴险]',
  '[亲亲]',
  '[吓]',
  '[可怜]',
  '[菜刀]',
  '[西瓜]',
  '[啤酒]',
  '[篮球]',
  '[乒乓]',
  '[咖啡]',
  '[饭]',
  '[猪头]',
  '[玫瑰]',
  '[凋谢]',
  '[示爱]',
  '[爱心]',
  '[心碎]',
  '[蛋糕]',
  '[闪电]',
  '[炸弹]',
  '[刀]',
  '[足球]',
  '[瓢虫]',
  '[便便]',
  '[月亮]',
  '[太阳]',
  '[礼物]',
  '[拥抱]',
  '[强]',
  '[弱]',
  '[握手]',
  '[胜利]',
  '[抱拳]',
  '[勾引]',
  '[拳头]',
  '[差劲]',
  '[爱你]',
  '[NO]',
  '[OK]',
  '[爱情]',
  '[飞吻]',
  '[跳跳]',
  '[发抖]',
  '[怄火]',
  '[转圈]',
  '[磕头]',
  '[回头]',
  '[跳绳]',
  '[挥手]',
  '[激动]',
  '[街舞]',
  '[献吻]',
  '[左太极]',
  '[右太极]',
  '[删除]'
]

const currentEmotions = [
  '[微笑]',
  '[撇嘴]',
  '[色]',
  '[发呆]',
  '[得意]',
  '[流泪]',
  '[害羞]',
  '[闭嘴]',
  '[睡]',
  '[大哭]',
  '[尴尬]',
  '[发怒]',
  '[调皮]',
  '[呲牙]',
  '[惊讶]',
  '[难过]',
  '[酷]',
  '[冷汗]',
  '[抓狂]',
  '[吐]',
  '[偷笑]',
  '[可爱]',
  '[白眼]',
  '[傲慢]',
  '[饥饿]',
  '[困]',
  '[惊恐]',
  '[流汗]',
  '[憨笑]',
  '[大兵]',
  '[奋斗]',
  '[咒骂]',
  '[疑问]',
  '[嘘]',
  '[晕]',
  '[折磨]',
  '[衰]',
  '[骷髅]',
  '[敲打]',
  '[再见]',
  '[擦汗]',
  '[抠鼻]',
  '[鼓掌]',
  '[糗大了]',
  '[坏笑]',
  '[左哼哼]',
  '[右哼哼]',
  '[哈欠]',
  '[鄙视]',
  '[委屈]',
  '[快哭了]',
  '[阴险]',
  '[亲亲]',
  '[吓]',
  '[可怜]',
  '[菜刀]',
  '[西瓜]',
  '[啤酒]',
  '[篮球]',
  '[乒乓]',
  '[咖啡]',
  '[饭]',
  '[猪头]',
  '[玫瑰]',
  '[凋谢]',
  '[示爱]',
  '[爱心]',
  '[心碎]',
  '[蛋糕]',
  '[闪电]',
  '[炸弹]',
  '[刀]',
  '[足球]',
  '[瓢虫]',
  '[便便]',
  '[月亮]',
  '[太阳]',
  '[礼物]',
  '[拥抱]',
  '[强]',
  '[弱]',
  '[握手]',
  '[胜利]',
  '[抱拳]',
  '[勾引]',
  '[拳头]',
  '[差劲]',
  '[爱你]',
  '[NO]',
  '[OK]'
]

export default props => {
  const {
    onClick = () => {}, // 点击表情事件
    onBackSpace = () => {} // 点击退格事件
  } = props

  const [state] = useState({
    data: _chunk(currentEmotions, 26)
  })

  // 获取头像网络地址
  const _getEmotionUrl = val => {
    let index = fullEmotions.indexOf(val)
    return `//res.waiqin365.com/d/common_mobile/images/emotion/im_ee_${index + 1}.png`
  }

  // 点击表情事件
  const handleClick = item => {
    onClick(item)
  }

  // 退格事件
  const handleBackSpace = () => {
    onBackSpace()
  }

  return (
    <Swiper
      className="wq-emotion-list"
      indicatorColor="#d0cdd1"
      indicatorActiveColor="#ff9008"
      circular
      indicatorDots
    >
      {state.data.map((items, i) => (
        <SwiperItem key={`wq-emotion-item-${i}`}>
          {items.map((item, j) => (
            <View key={`wq-emotion-${j}`} className="wq-emotion" onClick={() => handleClick(item)}>
              <Image src={_getEmotionUrl(item)} />
            </View>
          ))}
          <View className="wq-emotion" onClick={handleBackSpace}>
            <Image src={_getEmotionUrl('[删除]')} />
          </View>
        </SwiperItem>
      ))}
    </Swiper>
  )
}
