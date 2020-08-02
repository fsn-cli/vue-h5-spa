# mk-logistics-card

## 使用示例
```JavaScript
  <mk-logistics-card
      class="demo-box-item"
      :product-type='productType'
      :status="status"
      :img="img"
      :des="des"
      :btn="btn"
      @click="handleClick()"
    ></mk-logistics-card>
```

| 属性          | 类型(默认值)  | 可选值         | 备注                        |
| ------------- | ------------- | ---------- | --------------------------- |
| product-type  | string("")    |    任意值   | 商品类型     |
| status        | string("")    |    任意值   | 物流状态     |
| img           | string("")    |    任意值   | 左侧图片     |
| des           | string("")    |    任意值   | 右侧描述     |
| btn           | string("")    |    任意值   | 按钮文案     |

| 方法      | 出参    | 参数枚举   | 备注    |
| -------- | ------- | -------  | ------- |
| clickBtn | 无       |    无    |    点击按钮操作     |