const { merge } = require('webpack-merge');
const { baseConfig } = require('./webpack.base.config');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin'); // css 压缩优化
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin'); // Webpack自带,无需安装(JS 压缩)

module.exports = merge(baseConfig, {
  mode: 'production',
  optimization: {
    minimizer: [
      // 在 webpack@5 中，你可以使用 `...` 语法来扩展现有的 minimizer（即 `terser-webpack-plugin`）
      new CssMinimizerPlugin(),
      new TerserPlugin({
        parallel: 4,
        terserOptions: {
          parse: {
            ecma: 8,
          },
          compress: {
            ecma: 5,
            warnings: false,
            comparisons: false,
            inline: 2,
          },
          mangle: {
            safari10: true,
          },
          output: {
            ecma: 5,
            comments: false,
            ascii_only: true,
          },
        },
      }),
    ],
  },
  module: {
    rules: [
      {
        test: /\.(css|less)$/i,
        use: [
          MiniCssExtractPlugin.loader,
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
  plugins: [
    new webpack.DefinePlugin({
      // 定义环境变量
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name]_[chunkhash:8].css',
    }),
  ],
});
