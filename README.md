## Meson Form

> React form component with focus on immer and JSON

Preview http://fe.jimu.io/meson-form/

### Usage

![](https://img.shields.io/npm/v/@jimengio/meson-form.svg?style=flat-square)

```bash
yarn add @jimengio/meson-form
```

Define forms in an array with mostly JSON(with functions and enumerables):

```tsx
let formItems: IMesonFieldItem[] = [
  {
    type: EMesonFieldType.Input,
    shouldHide: (form) => {
      return form.amount && form.amount > 6;
    },
    label: "单价",
    name: "price",
    required: true,
  },
];
```

The pass items to the form:

```tsx
import { MesonForm, MesonFormModal } from "@jimengio/meson-form";

<MesonForm
  initialValue={{}}
  items={formItems}
  onSubmit={(form) => {
    console.log("submit data", form);
  }}
  onCancel={() => {
    console.log("cancel");
  }}
/>;
```

Probably it's used in a Modal:

```tsx
let [formVisible, setFormVisible] = useState(false);

<MesonFormModal
  title={lingual.labelShouldBeBoolean}
  visible={formVisible}
  onClose={() => {
    setFormVisible(false);
  }}
  items={formItems}
  initialValue={{}}
  onSubmit={(form) => {
    console.log("form", form);
    setFormVisible(false);
  }}
/>;
```

### Types(类型)

`IMesonFieldItem` 的不同类型, 对应的表单上的不同元素或者结构

- `Input`, 文本框类型, 设置 `textarea: true` 之后样式显示为多行输入, 逻辑保持一致.
- `Number`, 数字类型,
- `Select`, 单选菜单, 需要传入 JSON 结构的 `options` 参数,
- `Custom`, 自定义渲染, 需要定义渲染函数, 基于给出的表单的值和 `onChange` 函数进行渲染,
- `Group`, 嵌套的分组,
- `Fragment`, 类似 Group 但是这个分组不进行嵌套, 用在属性批量控制显示隐藏的情况.

关于表单的具体参数:

```ts
export let MesonForm: SFC<{
  /** 初始值, 后续的更新都在表单内部进行, 包括自定义渲染也是把修改传回到组件内部,
   * 可能会需要通过 key 重置表单, 比如 load 服务端数据回来需要重新初始化的情况
   */
  initialValue: any;
  /** JSON 结构的表单定义, 建议定义变量传过来, 一来定义会比较长, 二来 TS 类型推断在变量加类型的情况才准确 */
  items: IMesonFieldItem[];
  onSubmit: (form: { [k: string]: any }, onServerErrors?: (x: ISimpleObject) => void) => void;
  onCancel?: () => void;
  className?: string;
  style?: CSSProperties;
  /** Footer 默认提供了几种布局, 但是更可能还是需要直接提供一个渲染方案进行自定义 */
  footerLayout?: EMesonFooterLayout;
  renderFooter?: (isLoading: boolean, onSubmit: () => void, onCancel: () => void) => ReactNode;
  isLoading?: boolean;
  /** 可能用在记录是否有修改的地方. 另外每个 item 上修改值的时候也有各自的 onChange 钩子 */
  onFieldChange?: (name: string, v: any) => void;
  submitOnEdit?: boolean;
}> = (props) => {
  // Form
};
```

### Workflow

https://github.com/jimengio/ts-workflow

### License

MIT
