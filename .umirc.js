
// ref: https://umijs.org/config/
export default {
  history: 'hash',
  treeShaking: true,
  hash: true,
  publicPath: './',
  outputPath: './render',
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: true,
      dva: {
        immer: true
      },
      dynamicImport: { webpackChunkName: true },
      title: 'EllaScreen',
      dll: true,
      routes: {
        exclude: [
          /models\//,
          /services\//,
          /model\.(t|j)sx?$/,
          /service\.(t|j)sx?$/,
          /components\//,
        ],
      },
    }],
  ],
}
