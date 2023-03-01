/*
 * @Author: CaiPeng
 * @Date: 2022-09-14 15:49:15
 * @LastEditors: caipeng
 * @LastEditTime: 2023-02-20 10:22:09
 * @FilePath: \qince-taro\src\pages\Blog\components\Panel\Body\index.js
 * @Description: 
 */
import { View, RichText } from '@tarojs/components'
import format from '@/utils/format'

import Model from '../../Model'
import Photo from '../../Photo'
import Address from '../../Address'

export default props => {
  const { value } = props

  // 点击日报正文事件
  const handleClick = () => {
    props.onClickContent && props.onClickContent()
  }

  const _formatContent = () => {
    let content = (value.content || '').replace(/<a (.*)>查看详情<\/a>/gi, '')
    let reg = new RegExp('<wqhref>(.*)##.*##<\\/wqhref>', 'gi')
    let link
    if (reg.test(content)) {
      link = RegExp.$1
      // console.log(link)
      // this.$set(this.value, 'wqHref', link)
      content = content.replace(reg, '')
    }
    return format.formatEmotion(content) +
        (
          (['4', '102', '103', '104', '105'].includes(value.blog_type) && value.work_type !== '') || value.udf_link || link
          ? ' <a class=\'wq-blog-anchor\'>查看详情</a>'
          : ''
        )
  }

  return (
    <View className="wq-blog-panel-bd">
      {value?.blog_type === '3' ? (
        <>
          {value?.comment_content && value?.comment_content !== '赞了我的日报' && (
            <RichText
              className="wq-blog-info"
              nodes={format.formatEmotion(value?.comment_content)}
            />
          )}
          <RichText
            className="wq-blog-target"
            nodes={
              `<em>${value?.commented_name}：</em>` + format.formatEmotion(value?.commented_content)
            }
          />
        </>
      ) : (
        <>
          {value?.model_value && value?.model_value.length > 0 && (
            <Model data={value?.model_value} />
          )}
          {value?.content && (
            <>
              <RichText
                className="wq-blog-info"
                nodes={_formatContent()}
                onClick={handleClick}
              />
            </>
          )}
          {value?.pictures && value?.pictures.length > 0 && <Photo value={value?.pictures} readonly disable />}
          {value?.location_a && <Address value={value} />}
        </>
      )}
    </View>
  )
}
