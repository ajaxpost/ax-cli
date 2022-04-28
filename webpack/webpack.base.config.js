const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const WebpackBar = require('webpackbar');
const Dotenv = require('dotenv-webpack');

const baseConfig = {
  entry: {
    index: path.resolve(__dirname, '../src/index.tsx'),
  },
  output: {
    filename: 'js/[name].[contenthash].js',
    path: path.resolve(__dirname, '../build'),
    publicPath: '/',
    clean: true,
    assetModuleFilename: 'assets/[hash][ext][query]',
  },
  optimization: {
    // 配置 optimization.moduleIds，让公共包 splitChunks 的 hash 不因为新的依赖而改变，减少非必要的 hash 变动
    moduleIds: 'deterministic',
    runtimeChunk: {
      name: 'runtimeChunk',
    },
    splitChunks: {
      chunks: 'async', // 可以选择对哪些chunk进行优化（all|async|initial）
      minSize: 30000, // 要生成的chunk的最小大小(b)
      maxSize: 1024 * 1024, // 把提取出来的模块打包生成的文件大小不能超过maxSize值，如果超过了，要对其进行分割并打包生成新的文件。单位为字节，默认为0，表示不限制大小。
      minChunks: 1, // 分割前必须共享模块的最小引用次数
      maxAsyncRequests: 6, // 按需加载 最大并行请求量
      maxInitialRequests: 4, // 初始化页面 最大并行请求量
      automaticNameDelimiter: '__', // chunk一般名称格式为（例如vendors~main.js）该项指分隔符
      cacheGroups: {
        // 缓存组可以继承和覆盖splitChunks.*全部属性
        vendors: {
          name: `chunk-vendors`,
          // test: /[\\/]node_modules[\\/]/, // test属性只有在cache group中操作 正则匹配chunk放到该缓存组中
          chunks: 'initial',
          priority: -10, // 优先级
        },
        common: {
          name: `chunk-common`,
          minChunks: 2,
          priority: -20,
          chunks: 'initial',
          reuseExistingChunk: true,
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.html$/i,
        use: 'html-loader',
      },
      {
        test: /\.(js|jsx)$/i,
        use: 'babel-loader',
        exclude: /node_modules/,
      },

      {
        test: /\.(png|jfif|jpg|svg|webp)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(ts|tsx)$/i,
        exclude: /node_modules/,
        use: ['ts-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html'),
      scriptLoading: 'blocking',
      hash: true,
      inject: 'body',
    }),
    new ESLintPlugin(),
    new WebpackBar({
      name: 'ax-cli',
      color: 'green',
    }),
    new Dotenv({
      path: path.resolve(__dirname, '../.env.development'),
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../src'),
      '@@': path.resolve(__dirname, '../.'),
      '@axios': path.resolve('src/config/http.js'),
    },
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  externals: {
    // 包名:使用时的名称(打包后会定义为全局变量)
    // moment: 'moment',
    // lodash: '_',
  },
};

module.exports = {
  baseConfig,
};
