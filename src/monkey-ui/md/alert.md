# mk-alert

## 使用示例
```JavaScript
// 单按钮弹窗 then 按钮回调
this.$alert({
  isSingle: true,
  buttonMessage: {
    agree: '关闭',
  },
  title: '标题',
  content: '内容',
}).then(() => {
  console.log('agree');
});

// 双按钮弹窗
this.$alert({ // then 确认类回调 catch 取消类回调
  isSingle: false,
  buttonMessage: {
    agree: '同意',
    disagree: '不同意',
  },
  title: '标题',
  content: '内容',
}).then(() => {
  console.log('agree');
}).catch(() => {
  console.log('disagree');
});

```

## 方法
| 方法名            | 说明        | 参数         | 备注         |
| -----------------| ---------  | ----------  | ------------ |
| this.$alert({})  | 显示        | Props对象         | 
## Props
| 参数                     | 类型         | 可选值       | 备注              |
| -------------           | ------------- | ----------  | ------------- |
| isSingle                | boolean       | true/false  | true（默认值）单按钮弹窗 false 双按钮弹窗|
| title                   | String('')    | 任意         | 弹窗标题必填项  |
| content                 | String('')    | 任意         | 弹窗内容必填项  |
| buttonMessage           | Object        |             | 控制按钮文案|
| buttonMessage.agree     | String('')    | 任意         | (双)确认类按钮文案/（单）按钮文案|
| buttonMessage.disagree  | String('')    | 任意         | (双)取消类按钮文案|