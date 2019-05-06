const MiniCssExtractPlugin = require('mini-css-extract-plugin'); //压缩分离css
const HtmlWebpackPlugin = require('html-webpack-plugin'); //html模板文件
const CleanWebpackPlugin = require('clean-webpack-plugin'); //打包前先清空
const CopyPlugin = require('copy-webpack-plugin');

const path = require('path');
const webpack = require('webpack');
const glob = require('glob');

module.exports = {
  mode:"development",
  entry:getEnteries(),
  output:{
    path:path.resolve(__dirname,"dist"),
    filename:"js/[name].js",
    publicPath:'/'
  },
  module: {
    rules:[
       {
          test: /\.js?$/, //转义ES6/ES7/
          loader: 'babel-loader',
          include: path.join(__dirname,'src'),
          exclude:/node_modules/
      },
      {
         test:/\.css$/,
         use:[
           {
             loader:MiniCssExtractPlugin.loader,
             options: {
             }
           },
           'css-loader',
           'postcss-loader' //postcss-loader 处理CSS3属性前缀
         ],
         include:path.join(__dirname,'./src'),
         exclude:/node_modules/
      },
      {
        test:/\.(jpg|png|gif|svg)/, //在js中引入图片
        use:{
          loader:'file-loader',
          options:{
            //limit:1024,
            name: '[name].[ext]',
            outputPath: "images", //image存放单独目录
            publicPath:"/images"
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
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
      chunkFilename:'/css/[id].css'
    }),
    new CopyPlugin([
       {
         from: path.resolve(__dirname,"src/static/jquery.min.js"),
          to: path.resolve(__dirname,"dist/js")
        },
        {
          from: path.resolve(__dirname,"src/static/swiper-3.4.2.min.js"),
           to: path.resolve(__dirname,"dist/js")
         },
        {
          from: path.resolve(__dirname,"src/static/swiper-3.4.2.min.css"),
           to: path.resolve(__dirname,"dist/css")
         },
         {
           from: path.resolve(__dirname,"src/static/bootstrap.min.css"),
            to: path.resolve(__dirname,"dist/css")
          },
         {
           from: path.resolve(__dirname,"src/images"),
            to: path.resolve(__dirname,"dist/images")
          },
          {
            from: path.resolve(__dirname,"src/fonts"),
             to: path.resolve(__dirname,"dist/fonts")
           },
    ]),
    ...newHtmlWebpackPlugins()
  ]
}


//获取多入口文件
function getEnteries(){
  let dirs = path.resolve(__dirname, './src/page');
  let files = glob.sync(dirs + '/**/*.js')
  let map = {};
  for (let i = 0; i < files.length; i++) {
      let filePath = files[i];
      let filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'));
      if(filename == "index"){
        filename = "home";
      }
      map[filename] = filePath;
  }
  map["common"] = path.resolve(__dirname, './src/js/common.js');
  return map;
}

function newHtmlWebpackPlugins(){
    let dirs = path.resolve(__dirname, './src/page')
    let htmls = glob.sync(dirs + '/**/*.html')
    let plugins=[]
    for (let i = 0; i < htmls.length; i++) {
        let filePath = htmls[i];
        let chunks_id = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'));
        filename = chunks_id+".html";
        if(chunks_id == "index"){
          chunks_id = "home";
        }
       plugins.push(new HtmlWebpackPlugin({
           filename: filename,
           template: "html-withimg-loader!"+path.resolve(__dirname,filePath),
           chunks: [chunks_id],
       }))
    }
    return plugins
}
