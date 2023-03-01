import { useState } from 'react'
import { View, Text } from '@tarojs/components'
import classNames from 'classnames'

import { Tabs } from '@/components/Tabs'
import { Icons } from '@/components/Icons'

import Drag from '../Drag'

import './index.less'

const BlogNav = ({ activeIndex, list = [], target = [], onSort, onAdd, onTabChange, onRemove, onComplete }) => {

  const [state, setState] = useState({
    editable: false,
    toggleTab: false
  })

  const _updateState = (val = {}) => {
    setState(prev => ({
      ...prev,
      ...val
    }))
  }

  // 点击tab页签
  const handleClickTab = (val) => {
    onTabChange?.(val)
  }

  const handleClickComplete = e => {
    e.stopPropagation()
    e.preventDefault()

    _updateState({editable: !state.editable})
    if (state.editable) {
      // 完成
      onComplete?.()
    }
  }

  const handleToggleTab = () => {
    if (state.toggleTab && state.editable) {
      // 当前处于编辑状态，收起弹窗，触发完成事件
      onComplete?.()
      _updateState({toggleTab: !state.toggleTab, editable: false})
    } else {
      _updateState({toggleTab: !state.toggleTab})
    }
    
  }

  const handleClickRemove = (newList) => {
    onRemove?.(newList)
    // (val) => onSort(val)
  }

  const handleClickAdd = (item) => {
    onAdd?.(item)
  }

  return (
    <View className='wq-navtab'>
      <Tabs current={activeIndex} scroll tabList={list} onClick={handleClickTab} />
      <View className={classNames('wq-navtab-toggle', {'wq-navtab-toggle-active': state.toggleTab})} onClick={handleToggleTab}></View>
      {
        state.toggleTab && <View className={classNames('wq-navtab-unfold', { 'wq-navtab-unfold-active': state.toggleTab })}>
        <View className='wq-navtab-header'>
          <View className='wq-navtab-title'>已添加分类</View>
          <View className='wq-navtab-switch' onClick={handleClickComplete}>
            {state.editable ? '完成' : '编辑'}
          </View>
          <View
            className={classNames('wq-navtab-toggle', { 'wq-navtab-toggle-active': state.toggleTab })}
            onClick={handleToggleTab}
          ></View>
        </View>
        <View className='wq-navtab-body'>
        {/* 选中区域 */}
          <View  className='wq-navtab-panel wq-navtab-selected-panel'>
          <Drag
            list={list.map(v => ({...v, dragId: v.id}))}
            moveable={state.editable}
            columns={3}
            renderItem={({data}, index) => (
              index === 0 ? (
                <View key={data.id} className='wq-navtab-item' dataId={data.id} style={{width: '100%'}}>
                  <View className='wq-navtab-badge'>{data.name}</View>
                </View>
              ) : (
                <View
                  className={classNames('wq-navtab-item', { 'wq-navtab-editable': state.editable })}
                  data-id={data.id}
                  style={{width: '100%'}}
                >
                  <View className='wq-navtab-badge'>{data.name}</View>
                  {!data.default && (
                    <Icons className='wq-icon-clear' value="clear" onClick={() => handleClickRemove(data)}></Icons>
                  )}
                </View>
              )
            )}
            // scrollTop={pageMetaScrollTop}
            onChange={handleClickRemove}
            onSortEnd={(val) => onSort(val)}
            // onScroll={({ scrollTop }) => {setPageMetaScrollTop(scrollTop)}}
            // itemWidth='109px'
          ></Drag>
            {/* {list.map((item, index) =>
              index === 0 ? (
                <View key={item.id} className='wq-navtab-item' dataId={item.id}>
                  <View className='wq-navtab-badge'>{item.name}</View>
                </View>
              ) : (
                <View
                  className={classNames('wq-navtab-item', { 'wq-navtab-editable': state.editable })}
                  data-id={item.id}
                >
                  <View className='wq-navtab-badge'>{item.name}</View>
                  {!item.default && (
                    <Icons className='wq-icon-clear' value="clear" onClick={() => handleClickRemove(item)}></Icons>
                  )}
                </View>
              )
            )} */}
          </View>
        </View>
        <View className='wq-navtab-header'>
          <View className='wq-navtab-title'>可添加分类</View>
        </View>
        {/* 未选中区域 */}
        <View className='wq-navtab-body'>
          <View
            className='wq-navtab-panel wq-navtab-unselected-panel'
            //  ref={setUnselectedWrapRef}
          >
            {target.length > 0 ? (
              target.map(item => (
                <View
                  key={item.id}
                  className={classNames('wq-navtab-item', { 'wq-navtab-editable': state.editable })}
                  onClick={() => handleClickAdd(item)}
                >
                  <View className='wq-navtab-badge'>{item.name}</View>
                  <Text className='wq-icon-clear'></Text>
                </View>
              ))
            ) : (
              <Text className='wq-navtab-item wq-navtab-item-empty'>暂无可添加分类</Text>
            )}
          </View>
        </View>
      </View>
      }
    </View>
  )
}

export default BlogNav
