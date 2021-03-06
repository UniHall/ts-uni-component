## 组件库介绍
该组件库为基于vue2.X + TypeScript以及element-ui创建的组件库

如果您觉得该组件库对您的开发有所帮助，欢迎您进行试用

::: tip
您可以全局引入该组件库，亦可按需引入。具体使用方式请向下翻阅。
:::
### 安装
npm install ts-uni-component
### 全局引入
::: warning
因为我们使用了element-ui中的组件，使用时需要同时引入element-ui.
:::

```
import ElementUI from 'element-ui'
Vue.use(ElementUI)
import TsUniComponent from 'ts-uni-component'
Vue.use(TsUniComponent)
import 'ts-uni-component/lib/style/index.css'
```


### 按需引入

``` 
import ElementUI from 'element-ui'
Vue.use(ElementUI)
import { TsUniTable } from 'ts-uni-component'
Vue.use(TsUniTable)
// 你可以 1、使用下面的代码引入全局公共样式；
import 'ts-uni-component/lib/style/index.css'

// 2、也可以仅使用响应组件的样式
// a.需要安装npm包 npm install babel-plugin-component -D
// b.修改babel.config.js或者.babelrc文件，修改代码如下：
plugins: [
  [
    'component',
    {
      libraryName: 'ts-uni-component',
      styleLibrary: {
        name: 'style',
        base: false
      }
    }
  ]
]
```
