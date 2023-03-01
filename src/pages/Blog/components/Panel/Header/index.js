/*
 * @Author: CaiPeng
 * @Date: 2022-09-14 15:49:15
 * @LastEditors: caipeng
 * @LastEditTime: 2023-02-23 10:48:00
 * @FilePath: \qince-taro\src\pages\Blog\components\Panel\Header\index.js
 * @Description:
 */
import { View, Text } from '@tarojs/components'

import Avatar from '@/components/Avatar'
import Rate from '@/components/Rate'

export default props => {
  const { value, onClickAvatar } = props

  // 点击头像事件
  const handleClickAvatar = () => {
    onClickAvatar && onClickAvatar()
  }

  return (
    <View className='wq-blog-panel-hd'>
      {value?.blog_type === '3' ? (
        <>
          <Avatar
            className='wq-blog-avatar'
            image={value?.publish_small_face}
            text={value?.commenter_name}
            onClick={handleClickAvatar}
          />
          <View className='wq-blog-title weui-flex'>
            <Text className='qince-blog-title-item'>{value?.commenter_name}</Text>
            {value?.comment_content === '赞了我的日报' ? '赞了' : '评论'}
            <Text className='qince-blog-title-item'>{value?.commented_name}</Text>的
            {value?.commented_type_name}
          </View>
        </>
      ) : (
        <>
          <Avatar
            className='wq-blog-avatar'
            image={value?.publish_small_face}
            text={value?.publish_name}
            onClick={handleClickAvatar}
          />
          <View className='weui-flex__item'>
            <View className='weui-flex'>
              <View className='weui-flex__item wq-blog-name'>{value?.publish_name}</View>
              {value?.blog_type !== '2' && value?.blog_type !== '100' && value?.score > 0 && (
                <View className='wq-blog-star'>
                  <Rate value={value?.score} readonly />
                </View>
              )}
            </View>
            <View className='wq-blog-dept weui-flex'>
              <Text className='weui-flex__item'>{value?.dept_name}</Text>
              <Text className='weui-flex__item' style={{ textAlign: 'right' }}>
                {value?.blog_type_name}
              </Text>
            </View>
          </View>
        </>
      )}
    </View>
  )
}
