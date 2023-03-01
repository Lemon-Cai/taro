import { View, Text, Picker } from '@tarojs/components'
import { useEffect, useState, useImperativeHandle, forwardRef } from 'react'
import classNames from 'classnames'

import { Cell, CellHeader, CellBody, CellFooter } from '@/components/Cell'
import { Textarea } from '@/components/Textarea'
import fetch from '@/utils/request'

import Select from '../Select'

import './index.less'

const Field = (props, ref) => {
  const { data = {}, value = '', blogType, onChange, onInputBlur, onInputFocus } = props

  const [options, setOptions] = useState(data.option || [])

  useImperativeHandle(ref, () => ({
    getOptions: () => options
  }))

  useEffect(() => {
    data.input === '5' && _initBlogSummary()
  }, []) // eslint-disable-line

  const _initBlogSummary = () => {
    fetch({
      url: `/app/blog/v8/getSummaryData.action`,
      method: 'POST',
      params: {}
    }).then(response => {
      if (response.code === '1') {
        let newOptions = (data.option || []).map(item => {
          let tmp = response.data.find(attr => attr.v_code === item.v_code)
          return {
            ...item,
            num: tmp ? tmp.num : '-'
          }
        })
        setOptions(newOptions)
        onChange && onChange(data, newOptions)
      }
    })
  }
  // 获取焦点
  const handleFocus = (e) => {
    onInputFocus && onInputFocus(data, e)
  }

  // 失去焦点
  const handleBlur = e => {
    onInputBlur && onInputBlur(data, e)
  }

  // 输入框改变值事件
  const handleChange = (field, val) => {
    console.log(val)
    onChange(field, val)
  }

  // 单选多选框事件
  const handleSelectChange = (field, val) => {
    onChange(field, val)
  }

  // 刷新总结数据
  const handleRefresh = () => {
    _initBlogSummary()
  }

  return (() => {
    let hd = (
      <View className='weui-flex'>
        <View
          className={classNames('weui-flex__item wq-label', {
            required: data.required === '1'
          })}
        >
          {data.label}
          {/* <span v-if="help" @click="$emit('on-click-help')"><WqIcon type="help"></WqIcon></span> */}
        </View>
      </View>
    )
    switch (data.input) {
      case '1': // 文本
        return (
          <Cell layout='vertical'>
            <CellHeader className='qince-cell_hd'>{hd}</CellHeader>
            <CellBody>
              <Textarea
                id={`publish-content-${blogType}-${data.id}`}
                clear={data.required !== '1'}
                autoHeight
                placeholder='请输入内容'
                placeholderStyle={{fontSize: '13px', color: '#aaa', padding: '8px 0'}}
                value={value}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChange={val => handleChange(data, val)}
                style={{ minHeight: 48 }}
              />
            </CellBody>
          </Cell>
        )
      case '3': // 单选
        return (
          <Cell layout='vertical' access>
            <CellHeader className='qince-cell_hd'>{hd}</CellHeader>
            <CellBody className='qince-cell_bd'>
              <Picker
                mode='selector'
                range={data.option}
                rangeKey='v'
                value={(value || []).map(v => v.index).join(',')}
                onChange={e =>
                  handleSelectChange(data, [
                    { ...data.option[e.target.value], index: e.target.value }
                  ])
                }
              >
                {value?.length > 0 ? (
                  <View className='picker'>{(value || []).map(v => v.v).join(',')}</View>
                ) : (
                  <View className='placeholder'>请点击选择</View>
                )}
              </Picker>
            </CellBody>
            <CellFooter className='qince-cell_ft'></CellFooter>
          </Cell>
        )
      case '4': // 多选
        return (
          <Select
            multiple
            // field={data}
            title={hd}
            data={(data.option || []).map(o => ({ ...o, id: o.v, name: o.v }))}
            value={data.value}
            placeholder='点击选择'
            onChange={val => handleChange(data, val)}
          />

          // <Cell layout='vertical' access>
          //   <CellHeader className='qince-cell_hd'>{data.label}</CellHeader>
          //   <CellBody className='qince-cell_bd'>
          //     {/* <MultiPicker
          //       mode='multiSelector'
          //       range={[1, 2,1234,41,41,54]}
          //       // rangeKey='v'
          //       onChange={(e) => handleSelectChange(data, e.detail.value)}
          //     >
          //       { data.value ? <View className='picker'>{data.value}</View> : (
          //         <View className='placeholder'>请点击选择</View>
          //       ) }
          //     </MultiPicker> */}
          //     { data.value ? <View className='picker'>{data.value}</View> : (
          //         <View className='placeholder'>请点击选择</View>
          //       ) }
          //   </CellBody>
          //   <CellFooter className='qince-cell_ft'></CellFooter>
          // </Cell>
        )
      case '5': // 统计
        let header = (
          <View className='weui-flex flex-middle'>
            <Text className='flex-1'>{data.label}</Text>
            <Text className='wq-blog-refresh' onClick={handleRefresh}>
              刷新
            </Text>
          </View>
        )
        return (
          <Cell layout='vertical'>
            <CellHeader className='qince-cell_hd'>{header}</CellHeader>
            <CellBody>
              <View className='wq-blog-summary'>
                {options.map((item, index) => (
                  <View key={`wq-blog-summary-item-${index}`} className='wq-blog-summary-item'>
                    <View className='wq-blog-summary-value'>{item.num || '-'}</View>
                    <View className='wq-blog-summary-label'>{item.v}</View>
                  </View>
                ))}
              </View>
            </CellBody>
          </Cell>
        )
      default:
        return null
    }
  })()
}


export default forwardRef(Field)
