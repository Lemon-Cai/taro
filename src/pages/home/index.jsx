/*
 * @Author: CaiPeng
 * @Date: 2022-09-14 15:37:31
 * @LastEditors: caipeng
 * @LastEditTime: 2023-03-06 17:36:10
 * @FilePath: \React\Taro\taro\src\pages\home\index.jsx
 * @Description: 
 */
import Taro from '@tarojs/taro'
import { useState } from 'react'
import { View, Text, Picker, Checkbox, Label, RootPortal, Block, Form, Input, CoverView  } from '@tarojs/components'
import { PageContainer } from '@tarojs/components'
import { Button } from '@tarojs/components'

import TaroPop from '@/components/TaroPop'
import FilterDropdown from '@/components/filterDropdown'
// import FuzzyQuery from '@/components/FuzzyQuery'
import Drag from '@/components/drag'

import './index.less'
import data from '../../mock/data'
import Dialog from '@/components/Dialog'
import Slide from '@/components/Slide'

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
    showRootPortal: false,

    isVisible: false,

    filterData: data,
    filterDropdownValue: [
      [1, 1, 0],				//第0个菜单选中 一级菜单的第1项，二级菜单的第1项，三级菜单的第3项
      [null, null],			//第1个菜单选中 都不选中
      [1],					//第2个菜单选中 一级菜单的第1项
      [[0], [1, 2, 7], [1, 0]],	//筛选菜单选中 第一个筛选的第0项，第二个筛选的第1,2,7项，第三个筛选的第1,0项
      [[0], [1], [1]],			//单选菜单选中 第一个筛选的第0项，第二个筛选的第1项，第三个筛选的第1项
    ],

    blogType: [{"id":"-1","name":"全部","title":"全部","type":"1","default":true,"lastTime":"2023-01-30 22:33:56.352",},{"id":"-2","name":"关注","title":"关注","type":"5","default":true},{"id":"-3","name":"@我的","title":"@我的","type":"2","default":true},{"id":"-4","name":"直属下级","title":"直属下级","type":"4","default":true},{"id":"-5","name":"评论","title":"评论","type":"1","default":true},{"id":"-6","name":"我自己的","title":"我自己的","type":"3"},{"id":"1","name":"日报","title":"日报"},{"id":"4","name":"拜访","title":"拜访"}]
  })

  const [pageMetaScrollTop, setPageMetaScrollTop] = useState(0)

	const [fileList, setFileList] = useState([
		{ dragId: 1, id: 1, url: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2F1113%2F052420110515%2F200524110515-2-1200.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1652595426&t=7558cd6e0e46df1b4a25a8ac3bb23ee2' },
		{ dragId: 2, id: 2, url: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fwww.2008php.com%2F09_Website_appreciate%2F10-07-11%2F1278861720_g.jpg&refer=http%3A%2F%2Fwww.2008php.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1652595426&t=8a143bb307d89fde4bec120fd2bbe3c2' },
		{ dragId: 3, id: 3, url: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fi-1.lanrentuku.com%2F2020%2F7%2F10%2Fb87c8e05-344a-48d1-869f-ef6929fc8b17.jpg&refer=http%3A%2F%2Fi-1.lanrentuku.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1652595426&t=a9d2ad78377ace857056b406eec1444f' },
		{ dragId: 4, id: 4, url: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2F1113%2F021620115230%2F200216115230-9-1200.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1652595426&t=826f4b01a1a1a2b6eb44e2225e6e8924' },
		{ dragId: 5, id: 5, url: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fdingyue.ws.126.net%2F2020%2F0515%2F465567a6j00qadpfz001cc000hs00b4c.jpg&refer=http%3A%2F%2Fdingyue.ws.126.net&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1652595426&t=391e28a0c87cb1b524f79bd572efdcf8' },
		{ dragId: 6, id: 6, url: 'https://img0.baidu.com/it/u=925998594,1358415170&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=281' },
		{ dragId: 7, id: 7, url: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimage.jiedianqian.com%2Fadmin%2F1547027280436.jpg&refer=http%3A%2F%2Fimage.jiedianqian.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1652595426&t=a7d2acf314f72fc12eb13e13b7333c6a' },
		{ dragId: 8, id: 8, url: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.redocn.com%2Fphoto%2F20131204%2FRedocn_2013112809170845.jpg&refer=http%3A%2F%2Fimg.redocn.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1652595426&t=36ed401679716f566c0e05964f08df97' },
		{ dragId: 9, id: 9, url: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Ffile02.16sucai.com%2Fd%2Ffile%2F2014%2F0814%2F17c8e8c3c106b879aa9f4e9189601c3b.jpg&refer=http%3A%2F%2Ffile02.16sucai.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1652595426&t=86cbb2e6a3a89ff94f763ea01bc71749' },
		{ dragId: 10, id: 10, url: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2Ftp01%2F1ZZQ214233446-0-lp.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1652595426&t=ca5c5f7defff5871410a767a46e81fe7' },
		{ dragId: 11, id: 11, url: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2Ftp05%2F19100120461512E-0-lp.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1652595426&t=6bb227b716e2087cde4ab4a15eefeb99' },
		{ dragId: 12, id: 12, url: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2Ftp05%2F1Z9291TIBZ6-0-lp.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1652595426&t=18f2a9a38867e7d63d1316848dbc58f3' },
		{ dragId: 13, id: 13, url: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.daimg.com%2Fuploads%2Fallimg%2F180314%2F1-1P314150U4.jpg&refer=http%3A%2F%2Fimg.daimg.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1652595426&t=f4fbe845bd22a2e0adf6d2151ce6c1ff' },
		{ dragId: 14, id: 14, url: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Ffile03.16sucai.com%2F2016%2F10%2F1100%2F16sucai_p20161021027_08b.JPG&refer=http%3A%2F%2Ffile03.16sucai.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1652595426&t=f27f3ade425ef26658618ba35555a161' },
	])

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

  // 
  const handleShowActionSheet = () => {
    Taro.showActionSheet({
      itemList: ['A', 'B', 'C'],
      success: function (res) {
        console.log(res.tapIndex)
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  }

  const handleScroll = () => {
    Taro.createSelectorQuery()
      .select('#scrollView')
      .node()
      .exec((res) => {
        console.log('======>', res)
        const scrollView = res[0].node;
        // scrollView.scrollEnabled = false;
      })
  }

  const handleConfirm = () => {

  }

  console.log('----------', state.showRootPortal);


  const handleShowDialog = () => {
    setState(prev => ({
      ...prev,
      dialogShow: !state.dialogShow
    }))
  }
  const handleFilterSubmit = (e) => {
    console.log('=======handleFilterSubmit :', e)
  }
  const handleFilterReset = () => {}

  return (
    <View className='page' id='scrollView'>

      <View className='section'>
        <FilterDropdown
          filterData={state.filterData}
          defaultSelected={state.filterDropdownValue}
          updateMenuName={true}
          confirm={handleConfirm}
          dataFormat='Object'></FilterDropdown>
      </View>

      <View className='section'>
        <View dangerouslySetInnerHTML={{ __html: html }}></View>
        <Text>Hello world!</Text>
      </View>

      <View className='section'>
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
      </View>

      <View className='section'>
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

      <View className='section'>
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

      <View className='section'>
        <Button onClick={handleToggle}>显示root-portal</Button>
        {state.showRootPortal && (
          <RootPortal>
            <View style={{ width: 150, height: 150, backgroundColor: '#faa' }}>content</View>
          </RootPortal>
        )}
        
      </View>

      <View className='section'>
        <Button
          onClick={() => {
            setState(prev => ({
              ...prev,
              isVisible: true
            }))
          }}>
          显示popup
        </Button>

        <TaroPop
          shade
          shadeClose
          isVisible={state.isVisible}
          onClose={() => {
            setState(prev => ({
              ...prev,
              isVisible: !state.isVisible
            }))
          }}>
          <Block>
            <View>popup</View>
          </Block>
        </TaroPop>
      </View>

      {/* <View className='section'>
        <FuzzyQuery />
      </View> */}

      <View className='section'>
        <Button onClick={handleShowActionSheet}>showActionSheet</Button>
      </View>

      <View className='section'>
        <Text>元素滚动</Text>
        <Button onClick={handleScroll}>scrollView</Button>
      </View>

      <View className='section'>
        <Drag
          list={state.blogType.map(v => ({...v, dragId: v.id}))}
          renderItem={({data}, index) => {
            return <View>{data.name}</View>
          }}
          columns={3}
          scrollTop={pageMetaScrollTop}
          onChange={(list) => setFileList([...list])}
          onSortEnd={(list) => setFileList([...list])}
          onScroll={({ scrollTop }) => {setPageMetaScrollTop(scrollTop)}}
          // itemWidth='109px'
        ></Drag>
      </View>

      <View className='section'>
        {/* <Comment /> */}
      </View>

      <View className='section'>
        <Button onClick={handleShowDialog}>显示dialog</Button>
        <Dialog show={state.dialogShow} width="50%" onClickMask={handleShowDialog}>
          <View className="filter_item">
            <View className="content">
              <Form onSubmit={e => handleFilterSubmit(e)} onReset={() => handleFilterReset()} >
                <View className='input_item'>
                  <View className="left">收货人</View>
                  <Input className="right" name="name" type='text' />
                </View>
                <View className="form_content">
                  <Button className="btn reset" formType="reset">重置</Button>
                  <Button className="btn" formType="submit">确定</Button>
                </View>
              </Form>
            </View>
          </View>
        </Dialog>
      </View>

      <View className='section'>
        <CoverView>
          <View>分级基金</View>
        </CoverView>
      </View>

      <View className='section'>
        <View>左滑删除示例</View>
        {
          state.list.map(item => (
            <Slide 
              field={item}
            />
          ))
        }
      </View>
    </View>
  )
}
