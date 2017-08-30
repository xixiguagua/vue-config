var path = require('path')
var utils = require('./utils')
var config = require('../config')
var vueLoaderConfig = require('./vue-loader.conf')
var projectRoot = path.rsolve(__dirname, '../')

var env = process.env.NODE_ENV
    // check env & config/index.js to decide weither to enable CSS Sourcemaps for the
    // various preprocessor loaders added to vue-loader at the end of this file
var cssSourceMapDev = (env === 'development' && config.dev.cssSourceMap)
var cssSourceMapProd = (env === 'production' && config.build.productionSourceMap)
var useCssSourceMap = cssSourceMapDev || cssSourceMapProd


function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  entry: {  //入口文件
    app: './src/main.js'
  },
  output: { //输出文件
    path: config.build.assetsRoot,//导出目录的绝对路径
    filename: '[name].js', //导出文件的文件名
	//生产模式或者开发模式下HTML，js等文件内部引用的公共路径
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
	//文件解析
  resolve: {
	//自动解析确定的扩展名，导入模块时不带扩展名
    extensions: ['.js', '.vue', '.json'],
	//创建import或者require的别名
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src')
    }
  },
  module: {  //模块解析
    rules: [
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [resolve('src'), resolve('test')],
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      {
        test: /\.vue$/, //Vue文件后缀
        loader: 'vue-loader',//使用vue-loader处理
        options: vueLoaderConfig//options是对vue-loader做的额外选项配置
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test')] //必须处理包含src和test文件夹
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000, //图片小于10000字节时以base64的方式引用
          name: utils.assetsPath('img/[name].[hash:7].[ext]') //文件名命名规则
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      },
	{
		test:/\.json$/,
		loader:'json'
	}
    ]
  },
    vue: {
    	loader: utils.cssLoaders({
	    sourceMap: useCssSourceMap
	}),
	postcss: [
	    require('autoprefixer')({
	    	browsers: ['last 10 versions']
	    })
	]
    }
}
