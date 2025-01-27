const path = require('path');
const webpack = require('webpack');
const merge = require("webpack-merge");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const ROOT_DIR = path.resolve(__dirname, '../');
const BUILD_DIR = ROOT_DIR + '/public';

module.exports = env => {
  const { PLATFORM, VERSION } = env;
  return merge([
    {
      entry: ['@babel/polyfill', ROOT_DIR + '/src/App.js'],
      output: {
        filename: 'bundle.js',
        path: BUILD_DIR
      },
      module: {
        rules: [
          {
            test: /\.(js|jsx)$/,
            exclude: path.resolve(__dirname, "node_modules"),
            use: ["babel-loader", "eslint-loader"]
          },
          {
            test: /\.(scss|css)$/i,
            use: [
              PLATFORM === 'production' ? MiniCssExtractPlugin.loader : 'style-loader',
              'css-loader',
              'sass-loader',
            ],
          },
          {
            test: /\.(woff(2)?|ttf|eot|svg|jpg|jpeg|png|gif)(\?v=\d+\.\d+\.\d+)?$/,
            use: [
              {
                loader: 'file-loader'
              }
            ]
          },
          {
            test: /\.html$/,
            exclude: /node_modules/,
            use: [
              {
                loader: "html-loader"
              }
            ]
          }
        ],
      },
      resolve: {
        extensions: ['*', '.js', '.jsx']
      },
      devServer: {
        contentBase: BUILD_DIR,
        // historyApiFallback: true
      },
      plugins: [
        new webpack.DefinePlugin({
          'process.env.VERSION': JSON.stringify(env.VERSION),
          'process.env.PLATFORM': JSON.stringify(env.PLATFORM)
        })
      ]
    }
  ])
};
