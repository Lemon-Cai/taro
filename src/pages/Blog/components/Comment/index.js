// import Taro from '@tarojs/taro'
import { View, Textarea, Text } from '@tarojs/components'
import { useState, useRef, useEffect } from 'react'
import { Icons } from '@/components/Icons'
import Rate from '@/components/Rate'
import Employee from '@/components/Employee'

import Popup from '../Popup'
import BlogEmotion, { fullEmotions } from '../Emotion'

import './index.less'

const Comment = ({
  showStar,
  score,
  show,
  value,
  placeholder = '说点什么吧...',
  contentStyle = {},
  onToggle,
  onSend,
  onChange
}) => {
  // input dom节点缓存
  const domStoreRef = useRef()
  const [textareaRef, setTextareaRef] = useState()
  const [state, setState] = useState({
    currentValue: value || '',
    currentScore: score ?? 0,
    emotionVisible: false,
    emp: []
  })

  useEffect(() => {
    setState(prev => ({
      ...prev,
      currentValue: value || ''
    }))
  }, [value])

  const handleToggle = () => {
    onToggle?.()
  }
  const handleToggleEmotion = () => {
    setState(prevState => ({
      ...prevState,
      emotionVisible: !prevState.emotionVisible
    }))
  }
  // 点击日报@
  const handleClickAt = () => {}

  // 点击表情事情
  const handleClickEmotion = item => {
    insertAtCursor(item)
  }

  // 删除表情事件
  const handleDeleteEmotion = () => {
    if (domStoreRef.current) {
      let { start, end } = domStoreRef.current

      let deleteVal = state.currentValue.substring(start - 1, start)
      let beforeVal = state.currentValue.substring(0, start - 1)
      let afterVal = state.currentValue.substring(start)
      let newValue = ''
      if (deleteVal === ']' && beforeVal.indexOf('[') > -1) {
        // 删除表情组
        let res = beforeVal.match(/(\[[\u4E00-\u9FA5]*)$/g)
        if (fullEmotions.includes(res + ']')) {
          let val = beforeVal.substring(0, beforeVal.lastIndexOf('['))
          newValue = val.concat(afterVal)
          domStoreRef.current.start = val.length
          domStoreRef.current.end = val.length
        }
      } else {
        // 删除文字
        newValue = beforeVal.concat(afterVal)
        domStoreRef.current.start = start - 1
        domStoreRef.current.end = end - 1
      }

      setState(prev => ({
        ...prev,
        currentValue: newValue
      }))
      onChange?.(newValue)
    }
  }

  const insertAtCursor = (info, flag) => {
    if (!domStoreRef.current) {
      _initDomStore()
    }
    if (domStoreRef.current) {
      let { start, end } = domStoreRef.current
      let tempStr1 = state.currentValue.substring(0, start)
      let tempStr2 = state.currentValue.substring(end)
      let newValue = tempStr1 + info + tempStr2

      // 更新
      setState(prev => ({
        ...prev,
        currentValue: newValue
      }))
      onChange?.(newValue)
      if (flag) {
        // _setCaretPosition()
      }

      let len = info.length
      domStoreRef.current.start = start + len
      domStoreRef.current.end = end + len
      // node.setSelectionRange(start + len, end + len)
      // node.focus()
    }
  }

  // 当选择表情，或者@人时，校验是否存在可输入的节点
  const _initDomStore = () => {
    if (!domStoreRef.current) {
      // 当前选择的页签中不存在模板，或默认有输入框。
      domStoreRef.current = {
        node: textareaRef,
        start: state.currentValue.length,
        end: state.currentValue
      }
    }
  }

  // 输入文本框聚焦
  const handleFocus = e => {
    // 关闭 表情弹窗
    setState(prev => ({
      ...prev,
      emotionVisible: false
    }))
  }

  const handleBlur = e => {
    let start = e.target.cursor
    domStoreRef.current = {
      node: e.target,
      start,
      end: start
    }
  }

  // const handleChange = value => {
  //   setState(prev => ({
  //     ...prev,
  //     currentValue: value
  //   }))
  // }

  const handleInput = e => {
    setState(prev => ({
      ...prev,
      currentValue: e.detail.value
    }))
    onChange?.(e.detail.value)
  }

  const handleRateChange = val => {
    setState(prev => ({
      ...prev,
      currentScore: val
    }))
  }

  const handleEmpChange = list => {
    console.log('first', list)
    if (Array.isArray(list)) {
      if (list?.length > 0) {
        // 去重
        let newList = list.filter(
          v => v.props?.type === 'emp' && !!!state.emp.find(o => o.id === v.id)
        )
        insertAtCursor(newList.map(v => `@${v.name || v.text} `).join(''))
      }
    }

    setState(prev => ({
      ...prev,
      emp: list || []
    }))
  }

  const handleClickSend = () => {
    if (showStar) {
      onSend?.(state.currentScore)
    } else {
      onSend?.()
    }
  }

  return (
    <Popup
      show={show}
      mask
      maskClosable
      title={
        showStar ? (
          <View className='wq-comment-hd'>
            <View className='wq-comment-rate'>
              <Text className='wq-comment-rate-label'>评分：</Text>
              <Rate onChange={handleRateChange} defaultValue={3} value={score || 3} />
            </View>
          </View>
        ) : null
      }
      onClose={handleToggle}
      contentStyle={{
        paddingLeft: 0,
        paddingRight: 0,
        borderRadius: 0,
        minHeight: '50px',
        maxHeight: '50%',
        overflow: 'hidden',
        background: '#f0f1f1',
        ...contentStyle
      }}
      footer={
        state.emotionVisible ? (
          <View className='wq-comment-ft'>
            <BlogEmotion onClick={handleClickEmotion} onBackSpace={handleDeleteEmotion} />
          </View>
        ) : null
      }
    >
      <View className='wq-comment-bd'>
        <View className='wq-comment-at' onClick={handleClickAt}>
          <Employee
            value={state.emp}
            empQueryParams={{
              isControl: '0'
            }}
            deptQueryParams={{}}
            onChange={handleEmpChange}
          >
            <Icons value='blog-at' />
          </Employee>
        </View>
        <View className='wq-comment-input wq-border-radius wq-flex-item'>
          <Textarea
            ref={setTextareaRef}
            placeholder={placeholder}
            value={state.currentValue}
            enableNative
            autoFocus
            autoHeight
            maxlength={10000}
            fixed
            // adjustPosition={false}
            cursorSpacing={15}
            disableDefaultPadding
            onFocus={handleFocus}
            onBlur={handleBlur}
            // onChange={handleChange}
            onInput={handleInput}
            // onLineChange={handleLineChange}
          />
        </View>
        <View className='wq-comment-emoji' onClick={handleToggleEmotion}>
          <Icons value={state.emotionVisible ? 'keyboard' : 'emoji'} />
        </View>
        <View className='wq-comment-send' onClick={handleClickSend}>
          发送
        </View>
      </View>
    </Popup>
  )
}

export default Comment
