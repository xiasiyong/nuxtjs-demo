# nuxtjs 学习

## github 仓库 和项目部署地址

```js
https://github.com/xiasiyong/nuxtjs-demo
http://106.75.189.28:3000/
```

## 路由配置

### 自动生成

nuxt 会自动根据pages文件夹的目录结果，为我们生成对应的路由表，具体的路径.nuxt/routes.js里面， 生产的规则参考官网

### 手动指定

```js
// /nuxt.config.js
module.exports = {
  router: {
    linkActiveClass: 'active',
    extendRoutes(routes, resolve) {
      // 先把自动生成的清空
       routes.splice(0)
      // 再添加自己的
       routes.concat([...your custorm routes])
    }
}
```

## static

静态目录，放在此目录下面的资源，直接可以通过根路径就可以直接访问

```js
比如： /static/main.css
访问的时候，可以直接通过http://ip:port/main.css
```



## app.html

nuxtjs提供得有一套默认的模板，如果我们需要添加一些自定义规则，可以手动在根目录下面创建一个app.html

```html
// 默认的模板， 可以在任意地方添加自己想要插入的内容
<!DOCTYPE html>
<html {{ HTML_ATTRS }}>
  <head {{ HEAD_ATTRS }}>
    {{ HEAD }}
  </head>
  <body {{ BODY_ATTRS }}>
    {{ APP }}
  </body>
</html>
```



## layout

根目录创建一个/layout/default.vue， 默认就是所有路由组件的父组件，代码如下：

```js
<template>
  <div>
    <nuxt />
 	<div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'layout',
  computed: {
    ...mapState([
      'user'
    ])
  }
}
</script>
```

如果路由组件不想使用默认的layout，则可以指定对应的layout，步骤分两步

1. 在/layout目录下面新建对应的布局组件（文件名就是自定义layout的名字）

2. 在对应的路由组件里面，通过layout属性指定

   ```js
   export default {
     layout: 'your customer lauout',
   }
   ```

## asyncData

#### 在A页面写了asyncData,此方法会在两种情况下调用

1. 直接访问A页面的时候，asyncData直接在服务端调用，该方法内部放回的对象，会跟data里面返回的对应进行合并，在客户端的时候不会调用
2. 从B页面跳转到A页面的时候，asyncData会在客户端被调用

#### aysncData接受一个参数，context

​	context是一个对象，里面包括很多属性，比如params，query，store，其他的可以自己打印出来看看

## store

#### 跟普通vuex使用的区别

1. 根目录下面创建store文件，则nuxt会默认把他当成store的配置

2. 配置的state，actions， mutations， getter全部都需要通过export导出，并且state是一个函数，而不是一个对象（因为服务端的时候，会有很多的用户会创建state，每个用户都是不一样的）

   ```js
   export const state = () => {
     return {
       user: null
     }
   }
   export const mutations = {
   }
   export const actions = {
   }
   ```

3. actions中，nuxtServerInit属性执行的方法，只会在服务端执行，并且是自动执行，此方法的作用就是初始化一些状态，比如，根据用户请求头里面传递的参数，初始化state

   ```js
   export const actions = {
     // 仅在服务端渲染
     nuxtServerInit ({ commit }, { req }) {
       let user = null
   
       // 如果请求头中有 Cookie
       if (req.headers.cookie) {
         // 使用 cookieparser 把 cookie 字符串转为 JavaScript 对象
         const parsed = cookieparser.parse(req.headers.cookie)
         try {
           user = JSON.parse(parsed.user)
         } catch (err) {
           // No valid cookie found
         }
       }
   
       // 提交 mutation 修改 state 状态
       commit('setUser', user)
     }
   }
   ```

## process

process里面有一些属性，可以区分当前程序的运行环境，比如procee.serve, process.client,这样我们可以很好的区分，那些操作在服务端/客户端才执行	

```js
const Cookie = process.client ? require('js-cookie') : undefined
```



## 插件

1. 使用

   - 在根目录下面创建plugins文件，并在里面添加对应的插件
   - 在nuxt.config.js中，通过plugins注册

   ```js
   // /plugins/dayjs.js
   import Vue from 'vue'
   import dayjs from 'dayjs'
   
   // {{ 表达式 | 过滤器 }}
   Vue.filter('date', (value, format = 'YYYY-MM-DD HH:mm:ss') => {
     return dayjs(value).format(format)
   })
   
   // /nuxt.config.js
   plugins: ['~/plugins/dayjs.js'],
   ```

   

2. 特点

   插件默认导出的函数，会被注入一个全局的context，在这个context里面，可以拿到很多信息，比如query、params、req、res、app、store...

   ```js
   // 通过插件机制获取到上下文对象（query、params、req、res、app、store...）
   // 插件导出函数必须作为 default 成员
   export default ({ store }) => {
   
     // 请求拦截器
     // Add a request interceptor
     // 任何请求都要经过请求拦截器
     // 我们可以在请求拦截器中做一些公共的业务处理,例如统一设置 token
     request.interceptors.request.use(function (config) {
       // Do something before request is sent
       // 请求就会经过这里
       const { user } = store.state
   
       if (user && user.token) {
         config.headers.Authorization = `Token ${user.token}`
       }
   
       // 返回 config 请求配置对象
       return config
     }, function (error) {
       // 如果请求失败(此时请求还没有发出去)就会进入这里
       // Do something with request error
       return Promise.reject(error)
     })
   }
   ```

   

## github CI/CD 集成

## linux环境



