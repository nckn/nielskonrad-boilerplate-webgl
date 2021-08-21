const { merge } = require('webpack-merge')
const path = require('path')

const config = require('./webpack.config')

module.exports = merge(config, {
  mode: 'development',

  devtool: 'inline-source-map',

  devServer: {
    port: 4321,
    writeToDisk: true,
    open: true
  },

  output: {
    path: path.resolve(__dirname, 'public')
  }
})
