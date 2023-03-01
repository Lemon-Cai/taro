// import Taro from '@tarojs/taro'
import { View, Label, Checkbox, Block, /* ScrollView, */ CheckboxGroup, Text, RootPortal } from '@tarojs/components'
import { useState, useMemo, useEffect } from 'react'
import classNames from 'classnames'
import { styled } from 'linaria/react'

import { Cell, CellHeader, CellBody, CellFooter } from '@/components/Cell'
// import { Icons } from '@/components/Icons'
import fetch from '@/utils/request'
import Popup from '../Popup'

import './index.less'

const StyledTitle = styled(View)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 32px;
  padding: 0 calc(12px + env(safe-area-inset-right)) 0 calc(12px + env(safe-area-inset-left));
  .cancel {
    color: #888888;
  }
  .confirm {
    color: #07c160;
  }
`

const Select = ({
  multiple,
  url,
  queryParams = {},
  contentType,
  data = [],
  value,
  readonly,
  required,
  title,
  placeholder,
  textField = 'name',
  valueField = 'id',

  onChange
}) => {
  // const { windowHeight } = Taro.getSystemInfoSync()

  const [dataSource, setDataSource] = useState([])
  const [state, setState] = useState({
    show: false,
  })
  const [currentValue, setCurrentValue] = useState([])

  useEffect(() => {
    if (Array.isArray(data) && !url) {
      setDataSource(
        data.map((item, index) => ({
          ...item,
          id: item[valueField] || index,
          name: item[textField]
        }))
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(data)])

  useEffect(() => {
    if (url) {
      _initData()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url])

  const _initData = () => {
    fetch({
      url: url,
      params: {
        ...queryParams
      },
      header: {
        'content-type': contentType ? contentType : 'application/json' // 默认值
      },
    }).then(res => {
      if (res.code === '1') {
        setDataSource((res.data || []).map((item) => ({
          ...item,
          id: item[valueField],
          name: item[textField]
        })))
      }
    })
  }

  useEffect(() => {
    if (state.show) {
      if (Array.isArray(value)) {
        setCurrentValue([...value])
      }
    }
  }, [value, state.show])

  // 切换弹层
  const handleToggle = () => {
    setState(prev => ({
      ...prev,
      show: !state.show
    }))
  }

  const handleConfirm = () => {
    onChange && onChange(currentValue)
    handleToggle()
  }

  const _displayValue = useMemo(() => {
    if (Array.isArray(value)) {
      return value.map(o => o?.[textField] ?? o).join('，')
    } else {
      return value?.[textField] || value
    }
  }, [value, textField])

  // 勾选
  const handleCheck = select => {
    if (!multiple) {
      // 单选
    } else {
      // 多选
      let newValue = [...currentValue]
      let tempIdx = newValue.findIndex(v => v._index === select._index)
      if (tempIdx !== -1) {
        // 存在即取消勾选
        newValue.splice(tempIdx, 1)
      } else {
        newValue.push(select)
      }
      setCurrentValue(newValue)
    }
  }

  // const _getKey = item => {
  //   return typeof item === 'object' ? item?.[valueField] : item
  // }
  // const _getValue = item => {
  //   return typeof item === 'object' ? item?.[textField] : item
  // }

  return (
    <Block>
      <Cell layout='vertical' className="qince-cell" access={!readonly}>
        {title && (
          <CellHeader className='qince-cell_hd'>
            <label className={classNames('qince-label', { required: required })}>
              {title}
              {/* <span @click="$emit('on-click-help')"><WqIcon type="help"></WqIcon></span> */}
            </label>
          </CellHeader>
        )}
        <CellBody className='qince-cell_bd' onClick={handleToggle}>
          {_displayValue ? (
            <View className='weui-flex__item'>{_displayValue}</View>
          ) : (
            placeholder && <View className='weui-flex__item placeholder'>{placeholder}</View>
          )}
          <CellFooter className='qince-cell_ft'></CellFooter>
        </CellBody>
      </Cell>
      <RootPortal>
        <Popup
          show={state.show}
          mask
          maskClosable
          title={
            <StyledTitle>
              <Text className='cancel' onClick={handleToggle}>
                取消
              </Text>
              <Text className='confirm' onClick={handleConfirm}>
                确定
              </Text>
            </StyledTitle>
          }
          onClose={handleToggle}
          contentStyle={{
            // paddingBottom: 0,
            paddingLeft: 0,
            paddingRight: 0,
            borderRadius: 0,
            minHeight: '120px',
            maxHeight: '50%',
            overflow: 'hidden',
            backgroundColor: '#ffffff'
          }}
        >
          <View style={{ overflowY: 'scroll' }}>
            <CheckboxGroup>
              {dataSource.map((item, index) => {
                let checked = currentValue.find(v => v.id === (item[valueField] || index))
                return (
                  <Label
                    key={index}
                    className='weui-cell weui-check__label'
                    onClick={() => handleCheck({ ...item, _index: index })}
                  >
                    <View className='weui-cell__bd'>{item.name}</View>
                    <View className='weui-cell__ft'>
                      <Checkbox
                        value={item.value}
                        checked={!!checked && checked?._index === index}
                        className='qince-checkbox'
                      />
                      {!!checked && checked?._index === index && (
                        <View className='qince-icon-selected'></View>
                      )}
                    </View>
                  </Label>
                )
              })}
            </CheckboxGroup>
          </View>
        </Popup>
      </RootPortal>
      
    </Block>
  )
}

export default Select
