###一点点前言
之前用过下面这两款跨平台软件，感觉功能相对比较局限。

 - 微信 TmT 团队开发的[weflow](https://weflow.io/)
 - 前端预处理器语言图形编译工具[Koala](http://koala-app.com/index-zh.html)

修修补补了几天终于把gulp搭建起来了，这次终于像样了些，至少比前面两款工具拓展了不少，gulp的强大之处不用多说，非常值得把玩。先来看看这次主要实现了哪些功能吧！

>1.  Sass语法编译；
>2.  静态资源压缩（包含html,css,js以及图片深压缩）；
>3. Css3自动前缀
>4. Image Sprite（图片精灵）
>5. md5后缀添加
>6. 路由及文件合并
>7. **页面模块iclude功能**
>8. 浏览器同步刷新

这次就是为了实现第7个iclude功能很是花费了一番功夫。

----
###首先gulp环境搭建。

1.首先全局安装gulp
```
$ npm install --global gulp
```

2.建议安装[淘宝镜像cnpm](https://npm.taobao.org/)，相比下载快的不是一点点。
```
$ npm install -g cnpm --registry=https://registry.npm.taobao.org
```
3.下载hello-gulp'
```
$ git@github.com:kpengWang/hello-gulp.git
```
4.直接安装所有packge里所有插件
```
$ cnpm install
```
>**一点小提示:**
>1.“--global”可以简写为“-g”
>2. "install"  可以直接用一个“i”代替

----

###基本介绍

先来看看目录各个文件目录的作用
![](https://p.qlogo.cn/qqmail_head/fFgUJknhibCz7BSqZicGhQH4ejMB2P7yFIgb9tAcAvrau49SGu8y6CS37OctW0edTPpAbQ49B21pQ/0)