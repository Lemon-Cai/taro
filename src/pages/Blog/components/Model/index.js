/*
 * @Author: CaiPeng
 * @Date: 2022-09-14 15:49:15
 * @LastEditors: caipeng
 * @LastEditTime: 2023-02-10 15:16:04
 * @FilePath: \qince-taro\src\pages\Blog\components\Model\index.js
 * @Description: 
 */
import { View, Text } from '@tarojs/components'
import { styled } from 'linaria/react'
import format from '@/utils/format'

const StyledModel = styled(View)`
  background: #f8f7f7;
  padding: 12px;
  margin-bottom: 12px;
  .wq-blog-stat-hd {
    line-height: 17px;
    font-size: 13px;
    color: rgba(0, 0, 0, 0.45);
  }
  .wq-blog-stat-bd {
    display: flex;
    flex-wrap: wrap;
    font-size: 15px;

    .wq-blog-stat-item {
      flex: 1;
      text-align: center;
      width: 33.33333%;
      min-width: 33.33333%;
      max-width: 33.33333%;
      margin-top: 12px;
      .wq-blog-stat-label {
        font-size: 15px;
        color: #1a1a1a;
        line-height: 18px;
      }
      .wq-blog-stat-value {
        font-size: 12px;
        color: #999;
        line-height: 15px;
        margin-top: 6px;
      }
    }
  }
`
const StyledView = styled(View)`
  margin-bottom: 8px;
  .wq-blog-model-label {
    font-size: 14px;
    color: #999;
    line-height: 1.4;
  }
  .wq-blog-model-value {
    font-size: 16px;
    color: #1a1a1a;
    line-height: 1.4;
    margin-top: 4px;
    img {
      width: 16px;
      height: 16px;
      vertical-align: -2px;
    }
  }
`

export default props => {
  const { data = [] } = props

  return data.map((model, index) => {
    return model.type === '5' ? (
      <StyledModel key={`wq-blog-stat-${index}`} className='wq-blog-stat'>
        <View className='wq-blog-stat-hd'>{model.label}</View>
        <View className='wq-blog-stat-bd'>
          {model.value.split(',').map((stat, i) => (
            <View key={`wq-blog-stat-item-${i}`} class='wq-blog-stat-item'>
              <View className='wq-blog-stat-label'>{stat.split(':')[1]}</View>
              <View className='wq-blog-stat-value'>{stat.split(':')[0]}</View>
            </View>
          ))}
        </View>
      </StyledModel>
    ) : (
      <StyledView key={`wq-blog-model-${index}`} className='wq-blog-model'>
        <Text className='wq-blog-model-label'>{model.label}</Text>
        {/* $options.filters.formatEmotion(model.value) */}
        <View className='wq-blog-model-value' dangerouslySetInnerHTML={{__html: format.formatEmotion(model.value)}}></View>
      </StyledView>
    )
  })
}
