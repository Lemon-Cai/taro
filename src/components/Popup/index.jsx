import { useState } from 'react'
import { View, Text, Picker, Checkbox, Label, RootPortal } from '@tarojs/components'
import { PageContainer } from '@tarojs/components'
import { Button } from '@tarojs/components'

import './index.less'

export default function Home() {
  const [state, setState] = useState({
    options: [
      [1, 2, 1234, 41, 41, 54],
      [12, '414', '暗黑地牢', '家里的']
    ],
    list: [
      {
        value: '美国',
        text: '美国',
        checked: false
      },
      {
        value: '中国',
        text: '中国',
        checked: true
      },
      {
        value: '巴西',
        text: '巴西',
        checked: false
      },
      {
        value: '日本',
        text: '日本',
        checked: false
      },
      {
        value: '英国',
        text: '英国',
        checked: false
      },
      {
        value: '法国',
        text: '法国',
        checked: false
      }
    ],
    showRootPortal: false
  })
  const html = `<h1 style="color: red">Wallace is way taller than other reporters.</h1>`

  const handleSelectChange = val => {
    setState({
      ...state,
      value: state.options[val]
    })
  }

  const handleOpenDialog = () => {
    setState({
      ...state,
      show: !state.show
    })
  }

  const handleToggle = () => {
    setState({
      ...state,
      showRootPortal: !state.showRootPortal
    })
  }

  console.log('----------', state.showRootPortal);

  return (
    <View className='page'>
      <View>
        <View dangerouslySetInnerHTML={{ __html: html }}></View>
        <Text>Hello world!</Text>
      </View>

      <Picker
        mode='multiSelector'
        range={state.options}
        // rangeKey='v'
        onChange={e => handleSelectChange(e.detail.value)}>
        {state.value ? (
          <View className='picker'>{state.value}</View>
        ) : (
          <View className='placeholder'>请点击选择</View>
        )}
      </Picker>

      <View>
        <Button onClick={handleOpenDialog}>打开弹窗</Button>
        <PageContainer
          show={state.show}
          duration={200}
          zIndex={100}
          overlay
          round={false} // 是否显示圆角
          position='right'
          customStyle='' // 自定义弹出层样式
          overlayStyle='' // 自定义遮罩层样式
          closeOnSlideDown={false} // 是否在下滑一段距离后关闭
          // onBeforeEnter={onBeforeEnter}
          // onEnter={onEnter}
          // onAfterEnter={onAfterEnter}
          // onBeforeLeave={onBeforeLeave}
          // onLeave={onLeave}
          // onAfterLeave={onAfterLeave}
          // onClickOverlay={handleClickOverlay} // 点击遮罩层时触发
        >
          <View>开打开打就是看到垃圾上单</View>
          <Button onClick={handleOpenDialog}>退出</Button>
        </PageContainer>
      </View>

      <View>
        <Text>推荐展示样式</Text>
        {state.list.map((item, i) => {
          return (
            <Label className='checkbox-list__label' for={i} key={i}>
              <Checkbox
                className='checkbox-list__checkbox'
                value={item.value}
                checked={item.checked}>
                {item.text}
              </Checkbox>
            </Label>
          )
        })}
      </View>

      <View>
        <Button onClick={handleToggle}>显示root-portal</Button>
        {state.showRootPortal && (
          <RootPortal>
            <View style={{ width: 150, height: 150, backgroundColor: "#faa" }}>content</View>
          </RootPortal>
        )}
      </View>
    </View>
  )
}
