# mk-loading

## 使用示例
```JavaScript
// 只有图标
this.$loading.show();

// 文字和图标
this.$loading.show('传入文字');

// forbidClick 属性可以禁用背景点击
this.$loading.show({ message:'传入文字', forbidClick: true });

// loading消失
this.$loading.hide();
```

## 方法
| 方法名            | 说明        | 参数         | 备注          |
| ------------------ | --------- | ----------  | ------------ |
| this.$loading.show | 显示       | 空/任意字符串 | 参数非必填     |
| this.$loading.hide | 隐藏       | 空          | 参数为空       |

## Props
| 参数           | 类型          | 可选值        | 备注              |
| ------------- | ------------- | ----------  | ------------- |
| message       | String('')    | 任意           | 文案            |
| forbidClick   | Boolean(false) | false/true   | 禁用背景点击      |
