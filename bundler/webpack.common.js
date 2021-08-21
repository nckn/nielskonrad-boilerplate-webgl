const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackPugPlugin = require('html-webpack-pug-plugin')
const MiniCSSExtractPlugin = require('mini-css-extract-plugin')
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin')
const path = require('path')

module.exports = {
  entry: path.resolve(__dirname, '../src/app.js'),
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
      template: path.resolve(__dirname, '../src/index.pug'),
      filename: 'index.pug',
      minify: false
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../src/subpage.pug'),
      filename: 'subpage.pug',
      minify: false
    }),
    // new HtmlWebpackPlugin({
    //   filename: 'index.pug',
    //   // template: path.resolve(__dirname, '../src/index.pug'),
    //   minify: true
    // }),
    // new HtmlWebpackPlugin({
    //   filename: 'subpage.html',
    //   template: path.resolve(__dirname, '../src/subpage.html'),
    //   minify: true
    // }),
    new ImageMinimizerPlugin({
      minimizerOptions: {
        plugins: [
          ['gifsicle', { interlaced: true }],
          ['jpegtran', { progressive: true }],
          ['optipng', { optimizationLevel: 8 }]
        ]
      }
    }),
    new HtmlWebpackPugPlugin(),
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
      // {
      //   test: /\.(jpg|png|gif|svg)$/,
      //   use: [
      //     {
      //       loader: 'file-loader',
      //       options: {
      //         name: '[path][name].[ext]'
      //         // outputPath: 'assets/images/'
      //       }
      //     }
      //   ]
      // },
      // Load image types
      {
        test: /\.(jpe?g|png|gif|svg|webp)$/i,
        use: [
          {
            loader: ImageMinimizerPlugin.loader
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
