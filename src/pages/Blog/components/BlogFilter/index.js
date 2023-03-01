import Taro from '@tarojs/taro'
import { View, Text, Form, Input, Picker } from '@tarojs/components'
import { useState } from 'react'
import dayjs from 'dayjs'
import { styled } from 'linaria/react'

import { Page, PageBody, PageAffix } from '@/components/Page'
import Dept from '@/components/Dept'
import Employee from '@/components/Employee'

import Dialog from '../Dialog'
import Select from '../Select'

import './index.less'

const StyledWrap = styled(View)`
  padding: 12px;
  position: relative;
  display: block;
  &::after {
    content: ' ';
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    height: 1px;
    border-top: 1px solid #e0e0e0;
    color: #e0e0e0;
    transform-origin: 0 0;
    transform: scaleY(0.5);
    pointer-events: none;
    left: 15px;
  }
  .cell-hd {
    margin-bottom: 4px;
    color: #808080;
    &.required {
      position: relative;
      &::before {
        content: '*';
        color: #f00000;
        position: absolute;
        left: -8px;
        top: 0;
      }
    }
    .weui-flex {
      align-items: center;
    }
  }
  .placeholder {
    color: #cccccc;
  }
`

const BlogFilter = ({ show, width, onClose, onSubmit, onReset }) => {
  const [state, setState] = useState({
    keyword: '',
    startDate: dayjs()
      .subtract(6, 'day')
      .format('YYYY-MM-DD'),
    endDate: dayjs().format('YYYY-MM-DD'),
    selectedBlogTypes: [],
    position: [],
    emp: [],
    dept: []
  })
  const handleCancel = () => {
    onClose?.()
  }
  const handleStartDateChange = e => {
    setState(prev => ({
      ...prev,
      startDate: e.detail.value
    }))
  }
  const handleEndDateChange = e => {
    setState(prev => ({
      ...prev,
      endDate: e.detail.value
    }))
  }

  const handleEmpChange = list => {
    console.log('handleEmpChange:', list)
    setState(prev => ({
      ...prev,
      emp: list
    }))
  }
  const handleDeptChange = list => {
    console.log('handleDeptChange:', list)
    setState(prev => ({
      ...prev,
      dept: list
    }))
  }
  const handlePositionChange = val => {
    console.log('handlePositionChange:', val)
    setState(prev => ({
      ...prev,
      position: val
    }))
  }

  const handleBlogTypeChange = val => {
    console.log('handleBlogTypeChange: ', val)
    setState(prev => ({
      ...prev,
      selectedBlogTypes: val
    }))
  }

  const handleInput = (e) => {
    setState(prev => ({
      ...prev,
      keyword: e.detail.value
    }))
  }

  const handleReset = () => {
    setState(prev => ({
      ...prev,
      keyword: '',
      startDate: dayjs()
        .subtract(6, 'day')
        .format('YYYY-MM-DD'),
      endDate: dayjs().format('YYYY-MM-DD'),
      selectedBlogTypes: [],
      position: [],
      emp: [],
      dept: []
    }))
    onReset?.()
  }

  const handleSubmit = () => {
    if (state.startDate && state.endDate) {
      const start = dayjs(state.startDate).unix()
      const end = dayjs(state.endDate).unix()
      if (start > end) {
        Taro.showToast({
          icon: 'none',
          title: '结束日期不能早于开始日期！'
        })
        return
      }
      const endLimit = dayjs(state.startDate)
        .add(30, 'day')
        .unix()
      if (end > endLimit) {
        Taro.showToast({
          icon: 'none',
          title: '起止日期只能选择30天内的日期！'
        })
        return
      }
    }
    if (!state.selectedBlogTypes || state.selectedBlogTypes.length === 0) {
      Taro.showToast({
        icon: 'none',
        title: '类型至少选中1个！'
      })
      return
    }

    let params = {
      'params.keyword': state.keyword || '',
      'params.end_date': state.endDate || '',
      'params.start_date': state.startDate || '',
      'params.blog_types': state.selectedBlogTypes.map(v => v.id) || '',
      'params.publish_ids': state.emp.map(v => v.id) || '',
      'params.depart_ids': state.dept.map(v => v.id) || '',
      'params.position_ids': state.position.map(v => v.id) || ''
    }

    console.log('================>>>>', params)
    onSubmit?.(params)
  }

  return (
    <Dialog show={show} width={width} onClickMask={onClose}>
      <Page>
        <PageAffix>
          <View className='wq-header'>
            <View className='wq-header-left' onClick={handleCancel}>
              <Text>取消</Text>
            </View>
            <View className='wq-header-title'>
              <Text>筛选</Text>
            </View>
            <View className='wq-header-right'></View>
          </View>
        </PageAffix>
        <PageBody>
          <Form>
            <View className='form-content'>
              <StyledWrap>
                <View className='cell-hd'>关键字</View>
                <View className='cell-bd'>
                  <Input placeholder='点击输入' placeholderStyle='color: #cccccc;' value={state.keyword} onInput={handleInput} />
                  {/* <View className='weui-flex'>
                    <Text className="weui-icon-arrow" />
                  </View> */}
                </View>
              </StyledWrap>
              <StyledWrap>
                <View className='cell-hd'>部门</View>
                <View className='cell-bd'>
                  <View className='weui-flex'>
                    <Dept
                      value={state.dept}
                      onChange={handleDeptChange}
                      className='weui-flex__item'
                    >
                      {state.dept?.length > 0 ? (
                        <View>{state.dept.map(v => v.name).join('，')}</View>
                      ) : (
                        <Text className='placeholder'>点击选择</Text>
                      )}
                    </Dept>
                    <Text className='weui-icon-arrow' />
                  </View>
                </View>
              </StyledWrap>
              <Select
                multiple
                title='职务'
                url='/sysapp/kpi/userface/getUserPosition.action'
                contentType='application/x-www-form-urlencoded'
                value={state.position}
                placeholder='点击选择'
                onChange={handlePositionChange}
              />
              <StyledWrap>
                <View className='cell-hd'>发布人</View>
                <View className='cell-bd'>
                  <View className='weui-flex'>
                    <Employee
                      value={state.emp}
                      onChange={handleEmpChange}
                      className='weui-flex__item'
                    >
                      {state.emp?.length > 0 ? (
                        <View>{state.emp.map(v => v.name).join('，')}</View>
                      ) : (
                        <Text className='placeholder'>点击选择</Text>
                      )}
                    </Employee>
                    <Text className='weui-icon-arrow' />
                  </View>
                </View>
              </StyledWrap>
              <StyledWrap className='page-section'>
                <View className='cell-hd'>开始时间</View>
                <View className='cell-bd'>
                  <Picker mode='date' value={state.startDate} onChange={handleStartDateChange}>
                    <View className='picker'>{state.startDate}</View>
                  </Picker>
                </View>
              </StyledWrap>
              <StyledWrap className='page-section'>
                <View className='cell-hd'>结束时间</View>
                <View className='cell-bd'>
                  <Picker mode='date' value={state.endDate} onChange={handleEndDateChange}>
                    <View className='picker'>{state.endDate}</View>
                  </Picker>
                </View>
              </StyledWrap>
              <Select
                multiple
                required
                title='类型'
                url='/app/blog/v8/getBlogType.do'
                value={state.selectedBlogTypes}
                placeholder='点击选择'
                onChange={handleBlogTypeChange}
              />
            </View>
            <View className='form-footer'>
              <View className='btn reset' formType='reset' onClick={handleReset}>
                重置
              </View>
              <View className='btn confirm' formType='submit' onClick={handleSubmit}>
                确定
              </View>
            </View>
          </Form>
        </PageBody>
      </Page>
    </Dialog>
  )
}
export default BlogFilter
