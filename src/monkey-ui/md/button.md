# mk-button

## 使用示例
```JavaScript
  // 默认是590px的按钮
  <mk-button>默认按钮 590px</mk-button>

  //size=large 670px正常态
  <mk-button size="large">670px正常态</mk-button>

  //type="disabled" 670px未激活
  <mk-button type="disabled" size="large">670px未激活</mk-button>

  //图标和文字类按钮
  <mk-button size="mini" icon="plus">240px正常态</mk-button>

  //线框按钮 写法1
  <mk-button plain>线框按钮</mk-button>

  //线框按钮 写法2
  <mk-button :plain=true>线框按钮</mk-button>
```

| 属性          | 类型(默认值)  | 可选值         | 备注                        |
| ------------ | ------------- | ----------  | --------------------------- |
| type         | string("")    | default/disabled | 正常态/未激活                |
| size         | string("")    | large/normal/small460/small300/mini | 按钮尺寸    |
| plain        | Boolena(false)    | true/false | 是否为线框按钮               |