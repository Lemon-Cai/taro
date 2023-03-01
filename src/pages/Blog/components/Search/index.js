/*
 * @Author: CaiPeng
 * @Date: 2022-09-14 15:49:15
 * @LastEditors: caipeng
 * @LastEditTime: 2023-02-10 14:41:08
 * @FilePath: \qince-taro\src\pages\Blog\components\Search\index.js
 * @Description: 
 */
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { styled } from 'linaria/react'

const StyledSearch = styled(View)`
  position: relative;
  padding: 8px;
  display: flex;
  box-sizing: border-box;
  background-color: var(--weui-BG-1);
  align-items: center;
  .qince-blog-search-form {
    position: relative;
    flex: 1;
    min-width: 0;
    /* text-align: center; */
    padding: 0 6px;
    height: 30px;
    line-height: 30px;
    justify-content: center;
    background-color: var(--weui-BG-2);
    border-radius: 4px;
    color: var(--weui-FG-1);
    .qince-blog-search-icon {
      font-size: 10px;
      color: #A9B1B9;
      width: 1.6em;
      height: 1.6em;
      margin-right: 4px;
      flex-shrink: 0;
    }
    .qince-blog-search-placeholder {
      font-size: 14px;
      color: #A9B1B9;
    }
  }
  .qince-blog-search-action {
    flex: 0 0 auto;
    display: block;
    margin-left: 10px;
    padding: 0px 10px;
    height: 30px;
    color: rgb(255, 255, 255);
    font-size: 14px;
    line-height: 30px;
    border-radius: 4px;
    background-color: #ff9008;
    transition: margin-right 0.3s ease 0s, opacity 0.3s ease 0s;
  }
`

export default props => {
    // 搜索
	const handleClickSearch = () => {
		props.onSearch?.()
	}

  return (
    <StyledSearch>
      <View className="qince-blog-search-form" onClick={handleClickSearch}>
        <Text className="weui-icon-search qince-blog-search-icon" />
        <Text className="qince-blog-search-placeholder">发布人/关键字</Text>
      </View>
      <View className="qince-blog-search-action" onClick={props.onAdd}>新增</View>
    </StyledSearch>
  )
}
