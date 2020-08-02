# mk-icon

## 使用示例
```JavaScript
  // 高亮
  <mk-icon icon="clock" ></mk-icon>

  // 置灰
  <mk-icon icon='clock' :isActive="false"></mk-icon>
```

| 属性          | 类型(默认值)  | 可选值         | 备注                        |
| ------------- | ------------- | ----------  | --------------------------- |
| icon          | string("")    | clock/time-table/star/coin/checked/lock/fail/success/identifyCode/warn | 类型     |
| isActive          | boolean(true)    | true/false | 高亮/置灰，非必填项            |