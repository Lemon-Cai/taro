import Taro, { Component } from '@tarojs/taro'
import { View, Text, Input, Form, ScrollView } from '@tarojs/components'

import { AtList, AtListItem, AtAccordion } from 'taro-ui'
import { searchCompanyLibrary } from '@/services/user'
import './index.less'
/********
 * @param placeholder String 默认请输入
 * @param title String 输入框名字【required】
 * @param clear Boolean 是否显示清楚按钮
 * @param searchCompanyLibrary Function 获取列表数据 [required] 接口请求
 *  @param searchCompanyLibraryList 回调传值 第一个参数为外层需要的文本值 
第二个参数为控制外面元素是不是存在的值
 *  @param companyName 用于编辑回显使用 外层传入
 *  @param  ScrollView 滚动取值
 * ****************** */
class FuzzyQuery extends Component {
  state = {
    applicantName: this.props.companyName || '',
    popLeft: 0,
    popWidth: 0,
    open: false,
    dataSource: [1, 2, 3],
    popTop: 0,
    selectItem: {},
    isSelectCompany: false,
    pageIndex: 1,
    pageSize: 10
  }
  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
    setTimeout(() => {
      this.handleGetDom()
    }, 100)
    // this.handleGetDom();
  }
  handleGetDom = () => {
    let _this = this
    Taro.createSelectorQuery()
      .select('.fuzzy-query .weui-input')
      .boundingClientRect(function(rect) {
        // rect.id; // 节点的ID
        // rect.dataset; // 节点的dataset
        // rect.left; // 节点的左边界坐标
        // rect.right; // 节点的右边界坐标
        // rect.top; // 节点的上边界坐标
        // rect.bottom; // 节点的下边界坐标
        // rect.width; // 节点的宽度
        // rect.height; // 节点的高度

        _this.setState({
          popLeft: rect.left,
          popWidth: rect.width,
          popTop: rect.height
        })
      })
      .exec()
  }
  //选中某一项时触发
  handleClick = (e, item) => {
    console.log(e, 'e')
    e.stopPropagation()
    e.preventDefault()

    this.setState(
      {
        open: false,
        applicantName: item.name,
        selectItem: item
      },
      () => {
        const { open } = this.state
        this.props.searchCompanyLibraryList && this.props.searchCompanyLibraryList(item.name, open)
      }
    )
  }
  //当输入框发生变化时
  handleChange = async keyWord => {
    var company = keyWord.detail.value
    //先编码
    var value = encodeURI(keyWord.detail.value)
    console.log(value, 'value')

    //如果少于2个字符，是不调用接口的，此时不显示公司公司列表弹窗，且将数据清空
    if (company.length < 2) {
      this.setState(
        {
          applicantName: company,
          open: false,
          dataSource: [],
          pageIndex: 1
        },
        () => {
          const { open } = this.state
          this.props.searchCompanyLibraryList && this.props.searchCompanyLibraryList(company, open)
        }
      )
      Taro.showToast({
        title: '请输入不少于两个字符',
        icon: 'none',
        mask: true
      })
    } else {
      const { pageIndex, pageSize, dataSource, open } = this.state
      let params = { keyWord: decodeURI(value), pageSize, pageIndex }
      const data = await searchCompanyLibrary(params)
      this.setState(
        {
          open: true,
          applicantName: company,
          dataSource: data.data.data,
          pageIndex: 1
        },
        () => {
          const { open } = this.state
          this.props.searchCompanyLibraryList && this.props.searchCompanyLibraryList(company, open)
        }
      )
    }
  }

  //触底函数
  onScrollToUpper = async () => {
    console.log('我在触底')

    const { pageIndex, pageSize, dataSource, applicantName } = this.state
    let applicantNameList = encodeURI(applicantName)
    let params = {
      keyWord: decodeURI(applicantNameList),
      pageSize,
      pageIndex: pageIndex + 1
    }
    const data = await searchCompanyLibrary(params)
    console.log(dataSource, 'dataSource')
    console.log(data.data.data, 'data')
    this.setState({
      // open: true,
      // applicantName: applicantName,
      dataSource: [...dataSource, ...data.data.data],
      pageIndex: pageIndex + 1
    })
  }
  render() {
    const { applicantName, popLeft, popWidth, open, popTop, dataSource } = this.state
    console.log(dataSource, 'dataSource')
    const scrollStyle = {
      zIndex: 100,
      height: '250px'
    }
    const { placeholder = '请输入', title = '', clear = false } = this.props
    return (
      <View
        className='position-relative fuzzy-query'
        id='fuzzy-query'
        onRef={node => (this.fuzzyWrap = node)}>
        <Form>
          <View className=' input-wrap'>
            <View className='flex-between input-item'>
              <Text className='input_title'>{title}</Text>
              <View
                className={
                  clear && applicantName ? 'search-input-show-clear' : 'search-input-wrap'
                }>
                <Input
                  placeholderStyle='color:#f8f8f8'
                  className='search-input'
                  value={applicantName}
                  onChange={this.handleChange}
                  placeholder={placeholder}></Input>
              </View>
              {clear && applicantName && (
                <div
                  className='at-input__icon '
                  onClick={() =>
                    this.setState({
                      applicantName: '',
                      dataSource: [],
                      open: false
                    })
                  }>
                  <span
                    className='taro-text at-icon 
at-icon-close-circle at-input__icon-close'></span>
                </div>
              )}
            </View>
          </View>
        </Form>

        <View
          style={{ top: `${popTop * 2}px` }}
          className={
            open
              ? 'show-fuzzy-pop position-absolute fuzzy-query-pop'
              : 'position-absolute fuzzy-query-pop'
          }>
          <ScrollView
            scrollY
            style={scrollStyle}
            scrollWithAnimation
            onScrollToLower={this.onScrollToUpper}
            // 使用箭头函数的时候 可以这样写 `onScrollToUpper={this.onScrollToUpper}`
          >
            <View
              style={{
                paddingLeft: `${popLeft - 12}px`,
                width: `${popWidth}px`
              }}>
              <AtList>
                {dataSource.length > 0 &&
                  dataSource.map(item => {
                    return (
                      <AtListItem
                        title={item.name}
                        onClick={e => this.handleClick(e, item, 'selectItem')}
                      />
                    )
                  })}
              </AtList>
            </View>
          </ScrollView>
        </View>
      </View>
    )
  }
}

export default FuzzyQuery
