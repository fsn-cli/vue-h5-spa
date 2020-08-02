# mk-top-tip

## 使用示例
```JavaScript
// 显示顶部提示信息
this.$topTip.show({
  message: '提示内容',
  isShow: true,
});

// 控制隐藏
this.$topTip.hide();

```

## 方法
| 方法名            | 说明        | 参数         | 备注         |
| -----------------| ---------  | ----------  | ------------ |
| this.$alert({})  | 显示        | Props对象         | 
## Props
| 参数                     | 类型         | 可选值       | 备注              |
| -------------           | ------------- | ----------  | ------------- |
| isShow                  | boolean       | true/false  | 控制是否显示|
| message                 | String('')    | 任意         | 顶部提示文案  |