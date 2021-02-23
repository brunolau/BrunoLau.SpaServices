var webpackConf = require('./webpack.config.js')
delete webpackConf.entry

module.exports = function (config) {
  config.set({
    browsers: ['PhantomJS'],
    frameworks: ['jasmine'],
    reporters: ['spec'],
    files: ['./ClientTests/unit/index.js'],
    preprocessors: {
      './ClientTests/unit/index.js': ['webpack']
    },
    webpack: webpackConf,
    webpackMiddleware: {
      noInfo: true
    }
  })
}
