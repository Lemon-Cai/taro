import Taro from '@tarojs/taro'
import { useState, useRef, useEffect } from 'react'
import { View, Text, Button, Textarea  } from '@tarojs/components'

function Comment() {
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState([])
  const textareaRef = useRef(null)
  const [selectionStart, setSelectionStart] = useState(0)
  const [selectionEnd, setSelectionEnd] = useState(0)

  useEffect(() => {
    if (textareaRef.current) {
      // setSelectionStart(textareaRef.current.selectionStart)
      // setSelectionEnd(textareaRef.current.selectionEnd)
      textareaRef.current.style.height = 'auto'
      // textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
      
    }
    console.log('textareaRef', textareaRef)
  }, [comment])

  function handleInput({ detail: { value, cursor: { start, end, cursor } } }) {
    setComment(value)
    setSelectionStart(cursor)
    setSelectionEnd(cursor)
  }

  function handleAddComment() {
    setComments([...comments, comment])
    setComment('')
  }

  function handleInsertText() {
    const newText = '这是一个新的内容。'
    setComment(comment.substring(0, selectionStart) + newText + comment.substring(selectionEnd))
    setSelectionStart(selectionStart + newText.length)
    setSelectionEnd(selectionStart + newText.length)
  }

  return (
    <View>
      <Textarea
        ref={textareaRef}
        value={comment}
        onInput={handleInput}
        placeholder="输入评论内容"
        style={{ minHeight: '100px', lineHeight: '20px' }}
        selectionStart={selectionStart}
        selectionEnd={selectionEnd}
      />
      <Button onClick={handleAddComment}>发布评论</Button>
      <Button onClick={handleInsertText}>插入内容</Button>
      <View>
        {comments.map((c, i) => (
          <Text key={i}>{c}</Text>
        ))}
      </View>
    </View>
  )
}

export default Comment