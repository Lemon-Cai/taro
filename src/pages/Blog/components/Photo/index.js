import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { forwardRef, useMemo, useState, useEffect, useImperativeHandle } from 'react'

import { Icons } from '@/components/Icons'

import './index.less'

const Photo = (props, ref) => {
  // 获取屏幕宽高度
  const { windowWidth } = Taro.getSystemInfoSync()

  const {
    prefix = '', // 图片前缀
    mode = 'aspectFill',
    value = [], // 照片数据
    max = 0,
    sourceType,
    readonly = false,
    disable = false,
    onClickUpload,
    onChange
  } = props

  const [currentValue, setCurrentValue] = useState([])

  useImperativeHandle(ref, () => ({
    clickUpload: handleClickUpload
  }))

  useEffect(() => {
    if (Array.isArray(value)) {
      setCurrentValue([...value])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(value)])

  const count = useMemo(() => max - value.length, [max, value])

  // 点击照片查看大图
  const handleClick = index => {
    Taro.previewImage({
      current: currentValue[index].pic,
      urls: currentValue.map(item => item.pic)
    })
  }

  const handleClickUpload = () => {
    if (onClickUpload) {
      onClickUpload()
    } else {
      Taro.chooseImage({
        count: count,
        sourceType: sourceType || ['album', 'camera'],
        success: function(res) {
          let pic = [...currentValue, ...res.tempFiles.map(o => ({ pic: o.path }))]
          setCurrentValue(pic)
          onChange?.(pic)
        },
        fail: function(err) {}
      })
    }
  }

  const handleDelete = (e, index) => {
    e.stopPropagation()
    let newVal = [...currentValue]
    newVal.splice(index, 1)
    setCurrentValue(newVal)
    onChange?.(newVal)
  }

  const width = (windowWidth - 54) / 4

  if (readonly) {
    return (
      <View className='wq-blog-photos'>
        {value.map((photo, index) => {
          return index < 3 ? (
            <View
              key={`wq-blog-photo-${index}`}
              className='wq-blog-photo'
              style={{
                width: width,
                height: width
              }}
              onClick={() => handleClick(index)}
            >
              {value.length > 3 && index === 2 && (
                <View>
                  <View className="wq-blog-photo-mask"></View>
                  <View className="wq-blog-photo-length">+{value.length - 3}</View>
                </View>
              )}
              <Image
                className="wq-blog-photo-image"
                mode={mode}
                src={`${prefix}${typeof photo === 'string' ? photo : `${photo.pic}?x-oss-process=style/zk320`}`}
              />
            </View>
          ) : ''
        })}
      </View>
    )
  }

  return (
    value.length > 0 && (
      <View className='wq-blog-photos'>
        {value.map((photo, index) => {
          return (
            <View
              key={`wq-blog-photo-${index}`}
              className='wq-blog-photo'
              style={{
                width: width,
                height: width
              }}
              onClick={() => handleClick(index)}
            >
              <Image
                className='wq-blog-photo-image'
                mode={mode}
                src={`${prefix}${
                  typeof photo === 'string' ? photo : `${photo.pic}?x-oss-process=style/zk320`
                }`}
              />
              {!disable && <Icons value='clear' onClick={e => handleDelete(e, index)} />}
            </View>
          )
        })}
        {count > 0 && !disable && (
          <View className='wq-uploader-btn-wrap'>
            <View className='wq-uploader-btn' onClick={handleClickUpload}></View>
          </View>
        )}
      </View>
    )
  )
}

export default forwardRef(Photo)
