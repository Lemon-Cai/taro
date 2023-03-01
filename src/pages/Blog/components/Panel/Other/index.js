/*
 * @Author: CaiPeng
 * @Date: 2022-09-14 15:49:15
 * @LastEditors: caipeng
 * @LastEditTime: 2023-02-23 14:25:11
 * @FilePath: \qince-taro\src\pages\Blog\components\Panel\Other\index.js
 * @Description: 
 */
import { View, RichText, Text } from '@tarojs/components'
import classNames from 'classnames'
import format from '@/utils/format'

import { Icons } from '@/components/Icons'

export default props => {
  const { value } = props

  // 回复
  const handleClickReply = (e, comment) => {
    e.stopPropagation()

    props?.onClickReply?.(value, comment)
  }

  const handleClickUserName = (e, item, type) => {
    e.stopPropagation()
    console.log('======>', item, type)
    if (type === '1') {
      // 点赞
    }
    if (type === '2') {
      // 评论
    }
  }

  return (
    ((value?.supports && value?.supports.length > 0) ||
      (value?.comments && value?.comments.length > 0)) && (
      <View className='wq-blog-panel-other'>
        {value?.supports && value?.supports.length > 0 && (
          <View className='wq-blog-praise'>
            <Icons value='praise-plain' />
            {value?.supports
              ?.map((su, index) => {
                return (
                  <Text key={su.id} onClick={e => handleClickUserName(e, su, '1')}>
                    {su.name}{index !== value?.supports?.length - 1 ? '、' : ''}
                  </Text>
                )
              })}
          </View>
        )}
        {value?.comments && value?.comments.length > 0 && (
          <View
            className={classNames('wq-blog-comments', {
              'wq-blog-comments-underline': value?.supports && value?.supports.length > 0
            })}
          >
            {value?.comments.map((comment, i) => (
              <View key={`wq-blog-comment-${i}`}>
                {/* FIXME:布局格式 */}
                {/* <Text>
                  <Text onClick={e => handleClickUserName(e, comment, '2')}>
                    {comment.commenter_name}
                  </Text>
                  {comment.commented_type === '3' && (
                    <>
                      回复{' '}
                      <Text onClick={e => handleClickUserName(e, comment, '2')}>
                        {comment.commented_name}
                      </Text>
                    </>
                  )}
                  ：
                </Text>
                <RichText
                  className='weui-flex__item'
                  nodes={format.formatEmotion(comment.comment_content)}
                  onClick={e => handleClickReply(e, comment)}
                /> */}

                <RichText
                  className="wq-blog-comment"
                  key={`wq-blog-comment-${i}`}
                  nodes={`<span>${comment.commenter_name}</span>${(comment.commented_type === '3'
                    ? '回复<span>' + comment.commented_name + '</span>：'
                    : '：') + format.formatEmotion(comment.comment_content)}`}
                  onClick={(e) => handleClickReply(e, comment)}
                />
              </View>
            ))}
          </View>
        )}
      </View>
    )
  )
}
