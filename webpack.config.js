const MiniCssExtractPlugin = require('mini-css-extract-plugin'); //压缩分离css
const HtmlWebpackPlugin = require('html-webpack-plugin'); //html模板文件
const CleanWebpackPlugin = require('clean-webpack-plugin'); //打包前先清空
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const glob = require('glob');

module.exports = {
  mode:"development",
  entry:getEnteries(),
  output:{
    path:path.resolve(__dirname,"dist"),
    filename:"assets/js/[name].[hash:6].js",
    publicPath:'/'
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
           },
           'css-loader',
           'postcss-loader'//postcss-loader 处理CSS3属性前缀
         ],
         include:path.join(__dirname,'./src'),
         exclude:/node_modules/
      },
      {
        test:/\.(jpg|png|gif|svg)/, //在js中引入图片
        use:{
          loader:'url-loader',
          options:{
            limit:1024,
            outputPath: 'assets/images', //image存放单独目录
            publicPath:'/assets/images'
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
  //watch: true, //实时监控
  watchOptions: {
    ignored: /node_modules/, //忽略不用监听变更的目录
    poll:1000, //每秒询问的文件变更的次数
    aggregateTimeout: 500 //防止重复保存频繁重新编译,500毫秒内重复保存不打包
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'assets/css/[name].css'
    }),
    ...newHtmlWebpackPlugins()

  ]

}



function getEnteries(){
  let obj = {};
  function get(dir) {
      try {
          let stat = fs.statSync(dir);
          if (stat.isFile()) {
            let extname = path.extname(dir);
            if(extname == ".js"){
              let fileName = dir.substring(dir.lastIndexOf('\\') + 1, dir.lastIndexOf('.'));
              obj[fileName] = dir;
            }
          } else {
              let files=fs.readdirSync(dir);
              files.map(file => path.join(dir,file)).forEach(item=>get(item));
          }
      } catch (e) {
      }
  }
  get(path.join(__dirname,'./src/page'));
  return obj;
}


function newHtmlWebpackPlugins(){
    let dirs = path.resolve(__dirname, './src/page')
    let htmls = glob.sync(dirs + '/**/*.html')
    let plugins=[]
    for (let i = 0; i < htmls.length; i++) {
        let filePath = htmls[i];
        let filename = filePath.substring(filePath.indexOf("\/page\/")+6);
       plugins.push(new HtmlWebpackPlugin({
           filename: filename,
           template: "html-withimg-loader!"+path.resolve(__dirname,filePath),
           chunks: [filename],
       }))
    }
    return plugins
}
