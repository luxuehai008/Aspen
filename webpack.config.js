const MiniCssExtractPlugin = require('mini-css-extract-plugin'); //压缩分离css
const HtmlWebpackPlugin = require('html-webpack-plugin'); //html模板文件
const CleanWebpackPlugin = require('clean-webpack-plugin'); //打包前先清空

const path = require('path');
const webpack = require('webpack');
const glob = require('glob');


module.exports = {
  mode:"development",
  entry:getEnteries(),
  output:{
    path:path.resolve(__dirname,"dist"),
    filename:"js/[name].[hash:6].js",
    publicPath:'/js'
  },
  module: {
    rules:[
       {
          test: /\.js?$/, //转义ES6/ES7/
          use: {
              loader: 'babel-loader',
              options:{
               "plugins": [
                  ["@babel/plugin-proposal-decorators", { "legacy": true }],
                  ["@babel/plugin-proposal-class-properties", { "loose" : true }]
               ]
              }
          },
          include: path.join(__dirname,'src'),
          exclude:/node_modules/
      },
      {
         test:/\.css$/,
         use:[
           {
             loader:MiniCssExtractPlugin.loader,
             options: {
               outputPath: 'css', //image存放单独目录
               publicPath:'/css'
             }
           },
           'css-loader',
           'postcss-loader'
         ], //postcss-loader 处理CSS3属性前缀
         include:path.join(__dirname,'./src'),
         exclude:/node_modules/

      },
      {
        test:/\.(jpg|png|gif|svg)/, //在js中引入图片
        use:{
          loader:'url-loader',
          options:{
            limit:1024,
            outputPath: 'images', //image存放单独目录
            publicPath:'/images'
          }
        }
      },
      {
        test: /\.(htm|html)$/i, //在HTML中使用图片
        loader:'html-withimg-loader'
      },
      {
        test: /\.less/,
        include: path.resolve(__dirname,'src'),
        exclude: /node_modules/,
        use: [{
            loader: MiniCssExtractPlugin.loader,
        },'css-loader','less-loader']
      }

    ]
  },
  devServer: { //配置本地服务器
    contentBase:path.resolve(__dirname,"dist"),
    host:"localhost",
    port:8080,
    compress:true
  },
  externals: { //映入外部库时不打包
    jquery: 'jQuery'
  },
  watch: true, //实时监控
  watchOptions: {
    ignored: /node_modules/, //忽略不用监听变更的目录
    poll:1000, //每秒询问的文件变更的次数
    aggregateTimeout: 500 //防止重复保存频繁重新编译,500毫秒内重复保存不打包
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
      chunkFilename:'css/[id].css'
    }),
    ...newHtmlWebpackPlugins()

  ]

}







//获取多入口文件
function getEnteries(){
  //获取page下的文件夹
  let dirs = path.resolve(__dirname, './src/page');
  let files = glob.sync(dirs + '/**/*.js')
  let map = {};

  for (let i = 0; i < files.length; i++) {
      let filePath = files[i];
      let filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'));
      map[filename] = filePath;
  }
  return map;
}

//
function newHtmlWebpackPlugins(){
    let dirs = path.resolve(__dirname, './src/page')
    let htmls = glob.sync(dirs + '/**/*.html')
    let plugins=[]
    for (let i = 0; i < htmls.length; i++) {
        let filePath = htmls[i];
        let filename_no_extension = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'));
        let filename=filename_no_extension.concat('.html')
       plugins.push(new HtmlWebpackPlugin({
           filename: filename,
           template: "html-withimg-loader!"+path.resolve(__dirname,filePath),
           chunks: [filename_no_extension],
       }))
    }
    return plugins
}
