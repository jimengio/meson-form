Meson Form 基本的用法是用 JSON 结构的数据定义规则, 然后交给 `<MesonForm/>` 组件渲染:

```tsx
let formItems: IMesonFieldItem[] = [
  {
    type: EMesonFieldType.Input,
    name: "name",
    label: "名字",
  },
  {
    type: EMesonFieldType.Input,
    name: "name",
    label: "名字禁用",
    disabled: true,
  },
];
```
