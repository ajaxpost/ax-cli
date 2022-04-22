const { merge } = require('webpack-merge');
const { baseConfig } = require('./webpack.base.config');
const webpack = require('webpack');
const path = require('path');

const port = 9090;

module.exports = merge(baseConfig, {
  mode: 'development',
  output: {
    publicPath: '/',
  },
  devtool: 'source-map',
  cache: {
    type: 'filesystem', // 使用文件缓存,提升构建速度,第一次构建会加大构建速度
  },
  module: {
    rules: [
      {
        test: /\.(css|less)$/i,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                modifyVars: {
                  '@primary-color': '#405ce2',
                  '@font-size-base': '12px',
                  '@border-radius-base': '5px',
                  '@box-shadow-base': '0 2px 8px rgb(0 0 0 / 15%)',
                  '@text-color': '#666',
                },
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
    ],
  },

  devServer: {
    static: {
      directory: path.resolve(__dirname, '../build'),
      serveIndex: true,
    },
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
    compress: true,
    host: '127.0.0.1',
    hot: true,
    port,
    open: true,
    historyApiFallback: true,
    proxy: {
      '/wh-console': {
        target: 'http://117.78.1.212:9090',
        pathRewrite: {
          '^/wh-console': '',
        },
        secure: false, // 默认情况下，不会代理HTTPS上的服务,如有需要将secure设为false
        // 官网: 默认情况下，代理时会保留主机头的来源，可以将 changeOrigin 设置为 true 以覆盖此行为。
        // 意思是: 默认情况下(changeOrigin:false),请求头中的Host是前端当前的服务,当changeOrigin:true时,请求头中的Host就是后端服务

        /**
         changeOrigin 设置为 false时
          假设你的前端服务器是 http://localhost:3000，后端是 http://localhost:8082。
          那么后端通过 request.getHeader(“Host”) 获取依旧是 http://localhost:3000。

         changeOrigin 设置为 true时
          如果你设置了 changeOrigin: true，那么后端通过 request.getHeader(“Host”) 获取才是 http://localhost:8082。代理服务器此时会根据请求的 target 地址修改 Host。
        * **/

        changeOrigin: true,
      },
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      // 定义环境变量
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
  ],
});
