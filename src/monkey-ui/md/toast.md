# mk-toast

## 使用示例
```JavaScript
// 发送失败
this.$toast({
  type: 'fail',
  duration: 4000,
  message: '发送失败',
});

// 发送成功
this.$toast({
  type: 'success',
  message: '发送成功',
});

//正在发送验证码
this.$toast({
  type: 'identifyCode',
  message: '正在发送验证码',
});

//香蕉币
this.$toast({
  type: 'coin',
  coin: 3,
  message: '分享成功，获得10积分',
});

// forbidClick 属性可以禁用背景点击
this.$toast({ message:'传入文字', forbidClick: true });

// 普通toast
this.$toast('保存失败');
```

## 方法
| 方法名            | 说明        | 参数         | 备注          |
| ------------------ | --------- | ----------  | ------------ |
| this.$toast        |           | Props/任意字符串 |           |

## Props
| 参数           | 类型          | 可选值        | 备注              |
| ------------- | ------------- | ----------  | ------------- |
| type          | String('')    | fail/success/identifyCode/coin  | 发送失败/发送成功/正在发送验证码/分享成功，香蕉币     |
| message       | String('')    | 任意           | 文案            |
| duration      | Number(2000)  | 任意           | 单位为毫秒，默认值2000，非必填项  |
| coin          | Number(0)     | 任意           | 香蕉币个数       |
| forbidClick   | Boolean(false) | false/true   | 禁用背景点击      |
