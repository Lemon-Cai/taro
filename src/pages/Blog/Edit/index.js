import Taro from '@tarojs/taro'

import { styled } from 'linaria/react'
import { useEffect, useState, useRef, useMemo } from 'react'
import { connect } from 'react-redux'

import { View, Text, PageContainer, Picker } from '@tarojs/components'
import classNames from 'classnames'
import dayjs from 'dayjs'

import { Page, PageBody, PageFooter } from '@/components/Page'
import { Cells, Cell, CellHeader, CellBody, CellFooter } from '@/components/Cell'
import { Form, FormItem } from '@/components/Form'
import { Flex, FlexItem } from '@/components/Flex'
import { Icons } from '@/components/Icons'
import { Textarea } from '@/components/Textarea'
import { Button } from '@/components/Button'

import { getAddress } from '@/utils/Geo'
import fetch from '@/utils/request'

import * as actions from '@/store/Blog'

import BlogField from '../components/Field'
import BlogEmotion, { fullEmotions } from '../components/Emotion'
import Photo from '../components/Photo'

import './index.less'

const StyledTitle = styled(View)`
  display: flex;
  align-items: center;
  .qince-icon-earth {
    margin-right: 6px;
  }
`
let loading = false

const Edit = props => {
  const {
    // 选中的日报模板
    selectedTemplate = {},

    // 发布人员权限范围
    deployRangeEnum = [],
    // 选中的发布范围
    selectedDeploy,
    // 选中发布范围的key
    selectedDeployKey,

    dispatchChangeState,
    dispatchUpdateBlog,
    dispatchUpdateBlogCache
  } = props

  // input dom节点缓存
  const domStoreRef = useRef()
  const photoRef = useRef()
  // 参数 模板 id
  // const { id } = Taro.getCurrentInstance()?.router?.params || {}
  const { app_param = {}, userInfo = {} } = Taro.getStorageSync('qince-loginInfo') || {}
  // 缓存key
  const storeKey = useMemo(() => `qince-blog-${userInfo?.userId}-${selectedTemplate.model_id}`, [
    userInfo,
    selectedTemplate
  ])

  const [state, setState] = useState({
    address: '', // 定位地址
    pictures: [],
    // attaches: [], // 附件
    latlon: '',
    locationPlaceholder: '', // 定位占位符
    // copyTo: '-1',
    emotionVisible: false,

    // showEmotion: '',

    // activeElement: '',
    // positionMap: new Map(),

    // content: '',
    // cursorPosition: 0,

    showPopup: false // 点击@ 弹出选择人员控件
  })

  useEffect(() => {
    Taro.setNavigationBarTitle({
      // title: `发${_getBlogTypeName(selectedTemplate.blog_type)}`
      title: `发${selectedTemplate.model_name}`
    })
    // 校验缓存中是否存在图片
    let cache = Taro.getStorageSync(storeKey)
    if (cache?.pictures) {
      setState(prev => ({
        ...prev,
        pictures: cache.pictures
      }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 禁用提交按钮
  const disabledSubmit = useMemo(() => {
    if (selectedTemplate.model_format) {
      let totalItems = selectedTemplate.model_format.filter(item => {
        return item.input !== '5'
      })
      let emptyItems = selectedTemplate.model_format.filter(item => {
        return !!item.value && item.input !== '5'
      })
      let requiredItems = selectedTemplate.model_format.filter(item => {
        return item.required === '1' && !item.value
      })
      if (totalItems.length > 0 && emptyItems.length === 0) {
        return true
      }
      if (requiredItems.length > 0) {
        return true
      }
    } else {
      if (!selectedTemplate.value) {
        return true
      }
    }
    return false
  }, [selectedTemplate])

  const deployRanges = useMemo(() => {
    return app_param?.blog?.blogall === '1'
      ? deployRangeEnum.filter(o => o)
      : deployRangeEnum.filter(item => item.key !== '0')
  }, [app_param, deployRangeEnum])

  // 点击获取定位
  const handleClickLocation = async () => {
    let { authSetting, errMsg } = await Taro.getSetting()
    console.log(authSetting, errMsg)
    setState(prevState => ({
      ...prevState,
      locationPlaceholder: '正在定位中，请稍后…'
    }))
    if (authSetting['scope.userLocation']) {
      const { code, message, latitude, longitude, address, latlon } = await getAddress({
        type: 'gcj02',
        isHighAccuracy: true
      })
      console.log({ code, message, latitude, longitude, address, latlon })
     
      if (code === '1') {
        // 定位成功
        setState(prevState => ({
          ...prevState,
          address,
          latlon,
          locationPlaceholder: ''
        }))
      } else {
        setState(prevState => ({
          ...prevState,
          locationPlaceholder: ''
        }))
      }
    } else {
      Taro.showToast({
        icon: 'none',
        title: '请开启手机定位功能'
      })
    }
  }

  // 清理定位信息
  const handleClearLocation = e => {
    e.stopPropagation()
    setState(prevState => ({
      ...prevState,
      address: '',
      latlon: '',
      locationPlaceholder: ''
    }))
  }
  const _getBlogTypeName = (type) => {
    let name = '日报'
    switch (type) {
      case '2':
        name = '分享'
        break
      case '3':
        name = '评论'
        break
      case '4':
        name = '拜访'
        break
      case '5':
        name = '周报'
        break
      case '6':
        name = '月报'
        break
      default:
        name = '日报'
    }
    return name
}
  // 点击发送日报
  const handleClickSend = () => {
    if (disabledSubmit || loading) {
      return
    }
    loading = true
    if (selectedDeployKey === '0') {
      Taro.showModal({
        content: '您编辑的内容将会发送给全公司，确定发送吗？',
        success () {
          _save()
        }
      })
    } else {
      _save()
    }
  }

  /* 获取日报汇总值 */
  const  _getSummaryValue = (item) => {
    if (item.input === '5') {
      return item.option.map(op => {
        return `${op.v}:${op.num}`
      }).join(',')
    } else if (item.input === '3' || item.input === '4') {
      if (Array.isArray(item.value)) {
        return (item.value || [])?.map(o => o.v)?.join('、')
      } else {
        return item?.value?.v || ''
      }
    }
    return item.value || ''
  }
  /* 获取日报模板值集合 */
  const _getModelValue = () => {
    if (selectedTemplate.model_format) {
      let result = selectedTemplate.model_format.map(item => {
        if (item.input === '5') {
          return {
            label: item.label,
            value: _getSummaryValue(item),
            type: item.input
          }
        } else {
          return {
            label: item.label,
            value: _getSummaryValue(item),
            type: item.input
          }
        }
      })
      return JSON.stringify(result)
    }
    return ''
  }
  const _save = () => {
    let params = {
      'params.pictures': '',
      'params.pictures_time': '',
      'params.terminal_type': '4',

      'params.blog_type': selectedTemplate.blog_type,
      'params.blog_type_name': _getBlogTypeName(selectedTemplate.blog_type),
      'params.copyto': selectedDeployKey === '-1' ? '' : selectedDeployKey,

      'params.location_a': state.address || '',
      'params.location_type': '1',
      'params.location_c': state.latlon || '',

      // params.attachments

      'params.token': +new Date(),
      // TODO: 
      'params.deptIds': '',
      'params.empIds': '',
    }

    if (selectedTemplate.model_format) {
      params['params.model_value'] = _getModelValue()
      params['params.model_id'] = selectedTemplate.model_id
    } else {
      params['params.content'] = selectedTemplate.value || ''
    }
    if (state.pictures.length > 0) {
      params['params.pictures'] = JSON.stringify(state.pictures.map(photo => {
        // TODO:
        return {serverId: photo.pic, fileName: photo.pic}
      }))
    }
    console.log('params: ', params)
    fetch({
      url: '/app/blog/v8/sendBlog.action',
      // url: '/app/blog/v8/web/saveBlogMain.action',
      method: 'POST',
      params: params,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(response => {
      if (response.code === '1') {
        Taro.showToast({
          icon: 'none',
          title: '新增成功',
          success () {
            loading = false
            _deleteCache()
            const pages = Taro.getCurrentPages()
            let delta = 2
            const current = pages[pages.length - delta]
            const eventChannel = current.getOpenerEventChannel()
            console.log(eventChannel)
            // 通知列表页面刷新数据
            eventChannel.emit('onReload')
            Taro.navigateBack({
              delta: delta
            })
          }
        })
      } else {
        loading = false
        Taro.showToast({
          icon: 'none',
          title: response.message,
          success () {
            loading = false
            _deleteCache()
          }
        })
      }
    })
  }

  // 附件
  // const handleClickAttach = () => {
  //   Taro.openDocument({
  //     filePath: ''
  //   })
  // }

  // 点击日报拍照
  const handleClickPhoto = () => {
    // 点击图片，把表情收起来
    setState(prevState => ({
      ...prevState,
      emotionVisible: false
    }))
    if (state.pictures?.length < 9) {
      Taro.chooseImage({
        count: 9 - state.pictures?.length,
        sourceType: ['album', 'camera'],
        success: function(res) {
          let pic = [...state.pictures, ...res.tempFiles.map(o => ({ pic: o.path }))]
          handlePhotoChange(pic)
        },
        fail: function(err) {}
      })
    }
  }

  const handlePhotoChange = (pic) => {
    setState({
      ...state,
      pictures: pic
    })
    // 设置缓存，更新selectedTemplate，以刷新最新保存时间
    let time = _setCache('pictures', '', pic)
    dispatchChangeState({
      selectedTemplate: {
        ...selectedTemplate,
        lastSaveTime: time
      }
    })
  }

  // 点击日报@
  const handleClickAt = () => {
    setState(prev => ({
      ...prev,
      showPopup: !state.showPopup
    }))
  }

  // 控制表情显隐
  const handleToggleEmotion = e => {
    setState(prevState => ({
      ...prevState,
      emotionVisible: !prevState.emotionVisible
    }))
    // 滚动到目标位置
    // Taro.pageScrollTo({
    //   selector: '.qince-blog-footer-ft'
    // })
  }

  // 点击表情事情
  const handleClickEmotion = item => {
    insertAtCursor(item)
  }

  // 删除表情事件
  const handleDeleteEmotion = () => {
    if (domStoreRef.current) {
      let newTemplate = { ...selectedTemplate }
      let { start, end, fieldId, type } = domStoreRef.current

      if (selectedTemplate.model_format) {
        let field = newTemplate.model_format.find(o => o.id === fieldId)
        if (field) {
          let currentValue = field.value || ''
          let deleteVal = currentValue.substring(start - 1, start)
          let beforeVal = currentValue.substring(0, start - 1)
          let afterVal = currentValue.substring(start)
          if (deleteVal === ']' && beforeVal.indexOf('[') > -1) {
            // 删除表情组
            let res = beforeVal.match(/(\[[\u4E00-\u9FA5]*)$/g)
            if (fullEmotions.includes(res + ']')) {
              let val = beforeVal.substring(0, beforeVal.lastIndexOf('['))
              currentValue = val.concat(afterVal)
              domStoreRef.current.start = val.length
              domStoreRef.current.end = val.length
            }
          } else {
            // 删除文字
            currentValue = beforeVal.concat(afterVal)
            domStoreRef.current.start = start - 1
            domStoreRef.current.end = end - 1
          }
          field.value = currentValue
          // 设置缓存
          let time = _setCache(fieldId, type, currentValue)
          newTemplate.lastSaveTime = time
        }
      } else {
        let { value = '' } = newTemplate
        let deleteVal = value.substring(start - 1, start)
        let beforeVal = value.substring(0, start - 1)
        let afterVal = value.substring(start)
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

        newTemplate.value = newValue
        // 设置缓存
        let time = _setCache(newTemplate.model_id, void 0, newValue)
        newTemplate.lastSaveTime = time
      }
      // 更新
      dispatchChangeState({
        selectedTemplate: newTemplate
      })
    }
  }

  const insertAtCursor = (info, flag) => {
    if (!domStoreRef.current) {
      _initDomStore()
    }
    let newTemplate = { ...selectedTemplate }
    if (domStoreRef.current) {
      let { start, end, fieldId, type } = domStoreRef.current
      if (fieldId) {
        // 模板field
        let val
        let field = newTemplate.model_format.find(o => o.id === fieldId)
        if (field) {
          let tempStr1 = (field.value || '').substring(0, start)
          let tempStr2 = (field.value || '').substring(end)
          val = tempStr1 + info + tempStr2
          field.value = val

          // TODO:设置缓存
          _setCache(fieldId, type, val)
          // 更新
          dispatchChangeState({
            selectedTemplate: newTemplate
          })
          if (flag) {
            _setCaretPosition()
          }
        }
      } else {
        let { value = '' } = newTemplate
        let tempStr1 = value.substring(0, start)
        let tempStr2 = value.substring(end)
        let newValue = (newTemplate.value = tempStr1 + info + tempStr2)

        _setCache(newTemplate.model_id, void 0, newValue)
        // 更新
        dispatchChangeState({
          selectedTemplate: newTemplate
        })
        if (flag) {
          _setCaretPosition()
        }
      }

      let len = info.length
      domStoreRef.current.start = start + len
      domStoreRef.current.end = end + len
      // node.setSelectionRange(start + len, end + len)
      // node.focus()
    }
  }

  const _setCaretPosition = () => {
    // let field = self.$refs['blogField-' + state.activeElement]
    // if (field) {
    //   let cursorPosition = state.positionMap.get(state.activeElement)
    //   field[0].$children[0].$refs.textarea.focus()
    //   self.$nextTick(() => {
    //     field[0].$children[0].$refs.textarea.setSelectionRange(cursorPosition, cursorPosition)
    //   })
    // } else {
    //   self.$nextTick(() => {
    //     if (this.$refs['blogField-0']) {
    //       this.$refs['blogField-0'].$refs.textarea.focus()
    //       this.$refs['blogField-0'].$refs.textarea.setSelectionRange(
    //         self.cursorPosition,
    //         self.cursorPosition
    //       )
    //     }
    //   })
    // }
  }

  // 输入文本框聚焦
  const handleFocus = () => {
    // 关闭 表情弹窗
    setState(prev => ({
      ...prev,
      emotionVisible: false
    }))
  }

  const handleBlur = e => {
    _getSelectionStart(undefined, e)
  }

  // 模板组件聚焦
  const handleFocusBlog = () => {
    // 关闭 表情弹窗
    setState(prev => ({
      ...prev,
      emotionVisible: false
    }))
  }

  const handleBlurBlog = (field, e) => {
    _getSelectionStart(field, e)
  }

  const _getSelectionStart = (field, e) => {
    let start = e.target.cursor
    domStoreRef.current = {
      node: e.target,
      start,
      end: start,
      fieldId: field?.id,
      type: field?.input
    }
  }

  // 当选择表情，或者@人时，校验是否存在可输入的节点
  const _initDomStore = () => {
    let { model_format, blog_type, model_id, value = '' } = selectedTemplate
    if (!domStoreRef.current) {
      // 当前选择的页签中不存在模板，或默认有输入框。
      if (!model_format) {
        domStoreRef.current = {
          // defaultId: model_id,
          node: document.querySelector(`#publish-content-${blog_type}-${model_id}`),
          start: value.length,
          end: value.length
        }
      } else {
        // 存在模板，是否存在输入框
        let first = model_format.find(v => ['1', '2'].includes(v.input))
        if (first) {
          domStoreRef.current = {
            fieldId: first.id,
            type: first.input,
            node: document.querySelector(`#publish-content-${blog_type}-${first.id}`),
            start: first.value?.length || 0,
            end: first.value?.length || 0
          }
        }
      }
    }
  }

  const handleChange = value => {
    let newTemplate = { ...selectedTemplate }

    newTemplate.value = value

    // TODO:设置缓存
    _setCache(newTemplate.model_id, '', value)

    // 更新数据
    dispatchChangeState({
      selectedTemplate: newTemplate
    })
  }

  // TODO:选择人员
  const handleEmpSubmit = val => {
    if (val && val.length > 0) {
      let names = val.map(item => {
        return `@${item.name} `
      })
      insertAtCursor(names.join(''), true)
    }
    handleClickAt()
  }

  

  // 修改field
  const handleFieldChange = (field, value) => {
    let newTemplate = { ...selectedTemplate }

    if (newTemplate.model_format) {
      // 模板
      let item = newTemplate.model_format.find(v => v.id === field.id)
      if (item) {
        if (item.input === '5') {
          // 更新模板的选项
          item.option = value
        } else {
          item.value = value
        }
      }
    } else {
      newTemplate.value = value
    }

    // 设置缓存
    _setCache(field.id, field.input, value)

    // 更新数据
    dispatchChangeState({
      selectedTemplate: newTemplate
    })
  }

  // 可见选择范围
  const handleDeployRangeChange = e => {
    // dispatchChangeState
    let selected = deployRanges[e.target.value] || {}
    dispatchChangeState({
      selectedDeploy: selected,
      selectedDeployKey: selected.key
    })
  }

  const _setCache = (templateId, type, val) => {
    let time = dayjs().format('HH:mm')
    let cache = Taro.getStorageSync(storeKey)
    // let json = {}
    // if (cache) {
    //   json = {
    //     ...cache
    //   }
    // }
    // if (type !== '5') {
    //   if (val && JSON.stringify(json[templateId]) !== JSON.stringify(val)) {
    //     json['lastSaveTime'] = time
    //   }
    // }
    // json[templateId] = val
    if (!cache) {
      cache = {
        [templateId]: val,
        lastSaveTime: time
      }
    } else {
      cache = {
        ...cache,
        [templateId]: val,
        lastSaveTime: time || cache.lastSaveTime
      }
    }
    Taro.setStorageSync(storeKey, cache)
    return time
  }

  // 删除对应的缓存
  const _deleteCache = () => {
    Taro.removeStorageSync(storeKey)
  }

  return (
    <Page>
      <PageBody>
        <Form className='qince-blog-form'>
          {Array.isArray(selectedTemplate.model_format) &&
          selectedTemplate.model_format.length > 0 ? (
            selectedTemplate.model_format.map((item, index) => {
              return (
                <BlogField
                  key={index}
                  blogType={selectedTemplate.blog_type}
                  data={item}
                  value={item.value}
                  onChange={handleFieldChange}
                  onInputFocus={handleFocusBlog}
                  // onInput={handleInputBlog}
                  onInputBlur={handleBlurBlog}
                />
              )
            })
          ) : (
            <FormItem>
              <Textarea
                // height={50}
                id='publish-content-2-0'
                value={selectedTemplate.value}
                autoFocus
                autoHeight
                maxlength={10000}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChange={handleChange}
                placeholder='您发的日报将会默认@您的直接领导'
                style={{ minHeight: '100px' }}
              />
            </FormItem>
          )}
          {state.pictures.length > 0 && (
            <FormItem>
              <Photo ref={photoRef} value={state.pictures} max={9} onClickUpload={handleClickPhoto} onChange={handlePhotoChange} />
            </FormItem>
          )}

          <FormItem>
            <Flex style={{ alignItems: 'center' }}>
              <FlexItem>
                <View
                  className={classNames('wq-blog-location', { active: state.latlon })}
                  onClick={handleClickLocation}
                >
                  <Icons value='location' />
                  <Text className='wq-blog-address'>
                    {state.address || state.locationPlaceholder || '我的位置'}
                  </Text>
                  {state.latlon && <Icons value='clear' onClick={handleClearLocation} />}
                </View>
              </FlexItem>
              {selectedTemplate.lastSaveTime && (
                <FlexItem className='wq-blog-time'>
                  最后保存：{selectedTemplate.lastSaveTime}
                </FlexItem>
              )}
            </Flex>
          </FormItem>

          {/* 附件 小程序没有 */}
          {state.attaches?.length > 0 && (
            <FormItem title='附件'>
              <Flex>
                <View>{state.attaches.map(v => v)}</View>
              </Flex>
            </FormItem>
          )}

          <FormItem
            title={
              <StyledTitle>
                <Icons value='earth' />
                <Text>可见范围</Text>
              </StyledTitle>
            }
          >
            <Picker
              mode='selector'
              range={deployRanges}
              rangeKey='label'
              onChange={handleDeployRangeChange}
            >
              {/* <View className='picker'>{selectedDeploy?.display || selectedDeploy?.label}</View> */}
              <View className='picker'>{selectedDeploy?.label}</View>
            </Picker>
          </FormItem>

          {/* <FormItem title='今日工作内容'>
            <Textarea height={50} />
          </FormItem>
          <FormItem title='明日工作安排'>
            <Textarea height={50} />
          </FormItem> */}
        </Form>
      </PageBody>
      <PageFooter>
        <View className='qince-blog-footer'>
          <Flex className='qince-blog-footer-bd'>
            <FlexItem>
              <View className='qince-blog-footer-btns'>
                {/* 小程序不支持附件的上传 */}
                {/* <View className='qince-blog-footer-btn' onClick={handleClickAttach}>
                  <Icons value='blog-attach' />
                </View> */}
                <View className='qince-blog-footer-btn' onClick={handleClickPhoto}>
                  <Icons value='blog-camera' />
                </View>
                <View className='qince-blog-footer-btn' onClick={handleClickAt}>
                  <Icons value='blog-at' />
                </View>
                <View className='qince-blog-footer-btn' onClick={handleToggleEmotion}>
                  <Icons value={state.emotionVisible ? 'keyboard' : 'emoji'} />
                </View>
              </View>
            </FlexItem>
            <View
              className={classNames('qince-blog-submit', {
                'qince-blog-submit-active': !disabledSubmit
              })}
              onClick={handleClickSend}
            >
              提交
            </View>
          </Flex>
          {state.emotionVisible && (
            <View className='qince-blog-footer-ft'>
              <BlogEmotion onClick={handleClickEmotion} onBackSpace={handleDeleteEmotion} />
            </View>
          )}
        </View>
      </PageFooter>
    </Page>
  )
}

const mapStateToProps = state => ({
  ...state.Blog
})

const mapDispatchToProps = {
  ...actions
}

export default connect(mapStateToProps, mapDispatchToProps)(Edit)
