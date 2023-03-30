function injectScript () {
  let scripts = ['//res.wx.qq.com/open/js/jweixin-1.6.0.js', '//open.work.weixin.qq.com/wwopen/js/jwxwork-1.0.0.js']
  return new Promise((resolve, reject) => {
    let count = 0
    for (let i = 0; i < scripts.length; i++) {
      let script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = scripts[i]
      document.body.appendChild(script)
      script.onload = () => {
        ++count >= 2 && resolve()
      }
      script.onerror = () => {
        reject()
      }
    }
  })
}

export default {
  injectScript
}