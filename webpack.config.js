/* eslint-disable no-var */
const path = require('path')
const webpack = require('webpack')
var Clean = require('clean-webpack-plugin')

var webpackConfig = require('./webpack-base-config')
webpackConfig.entry = path.resolve(__dirname, 'src/index.js')

if (process.env.npm_lifecycle_event === 'release') {
  webpackConfig.plugins.push(new webpack.LoaderOptionsPlugin({ minimize: true, debug: false }))
  webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      mangle: true,
      sourceMap: true,
      comments: false,
      output: {comments: false}
    })
  )
} else if (process.env.npm_lifecycle_event !== 'start') {
  webpackConfig.plugins.push(new Clean(['dist'], {verbose: false}))
}

webpackConfig.output = {
  path: path.resolve(__dirname, 'dist'),
  filename: 'clappr-logo-plugin.js',
  library: 'LogoPlugin',
  libraryTarget: 'umd'
}

module.exports = webpackConfig
