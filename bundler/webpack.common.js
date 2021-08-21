const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCSSExtractPlugin = require('mini-css-extract-plugin')

const dirAssets = path.join(__dirname, 'assets')

module.exports = {
  entry: path.resolve(__dirname, '../src/app.js'),
  resolve: {
    modules: [
      dirAssets
    ]
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    // publicPath: "/",
    filename: 'bundle.[contenthash].js',
    // chunkFilename: "static/js/[name].chunk.js"
  },
  devtool: 'source-map',
  plugins: [
    new CopyWebpackPlugin({
      patterns: [{ from: path.resolve(__dirname, '../static') }]
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, '../src/index.html'),
      minify: true
    }),
    new HtmlWebpackPlugin({
      filename: 'subpage.html',
      template: path.resolve(__dirname, '../src/subpage.html'),
      minify: true
    }),
    new MiniCSSExtractPlugin()
  ],
  module: {
    rules: [
      // HTML
      {
        test: /\.(html)$/,
        use: ['html-loader']
      },

      // JS
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },

      // CSS
      {
        test: /\.css$/,
        use: [MiniCSSExtractPlugin.loader, 'css-loader']
      },

      // Images
      {
        test: /\.(jpg|png|gif|svg)$/,
        use: [
          {
            loader: 'file-loader',
            // options: {
            //   outputPath: 'assets/img/'
            // }
          }
        ]
      },

      // Fonts
      {
        test: /\.(ttf|eot|woff|woff2)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'assets/fonts/'
            }
          }
        ]
      },

      // Shaders
      {
        test: /\.(glsl|vs|fs|vert|frag)$/,
        exclude: /node_modules/,
        use: ['raw-loader', 'glslify-loader']
      }
    ]
  }
}
