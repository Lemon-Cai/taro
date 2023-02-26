// babel-preset-taro 更多选项和默认值：
// https://github.com/NervJS/taro/blob/next/packages/babel-preset-taro/README.md
module.exports = {
  plugins: ['@babel/plugin-proposal-optional-chaining'],
  presets: [
    [
      'taro',
      {
        framework: 'react',
        ts: false,
        'dynamic-import-node': process.env.TARO_ENV !== 'h5'
      }
    ],
    '@linaria'
    // [
    //   '@babel/preset-env',
    //   {

    //   }
    // ],
    // ['@babel/preset-react', {}]
    // ['@babel/preset-env', '@babel/preset-react']
  ]
}
