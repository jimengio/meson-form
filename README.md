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
    type: "input",
    name: "name",
    label: "名字",
  },
  {
    type: "input",
    shouldHide: (form) => {
      return form.amount && form.amount > 6;
    },
    label: "单价",
    name: "price",
    required: true,
  },
];
```

[meson-drafter](http://tools.mvc-works.org/meson-drafter/) can be helpful in generating JSON configs.

The pass items to the form:

```tsx
import { MesonForm } from "@jimengio/meson-form";

let FormBasic: FC<{}> = (props) => {
  let [form, setForm] = useState({});

  return (
    <div className={cx(row, styleContainer)}>
      <MesonForm
        initialValue={form}
        items={formItems}
        onSubmit={(form) => {
          setForm(form);
        }}
      />
    </div>
  );
};
```

### Hooks API for items

`useMesonItems` API is like `<MesonForm>` but instead returns elements and a `onCheckSubmit` function. Thus any kind of footer can be rendered by user:

```tsx
let [formElements, onCheckSubmit, formInternals] = useMesonItems({
  initialValue: form,
  items: formItems,
  onSubmit: (form) => {
    setForm(form);
  },
});

return (
  <div>
    {formElements}
    <button onClick={onCheckSubmit}>Submit</button>
  </div>
);
```

> This API is in early stage. Return values can be extended in the future.

### Modal API

Probably it's used in a Modal:

```tsx
import { MesonFormModal } from "@jimengio/meson-form";

let [formVisible, setFormVisible] = useState(false);

<MesonFormModal
  title={lingual.labelShouldBeBoolean}
  visible={formVisible}
  onClose={() => {
    setFormVisible(false);
  }}
  width={800}
  items={formItems}
  initialValue={{}}
  hideClose={false}
  onSubmit={(form) => {
    setFormVisible(false);
    console.log("form", form);
  }}
/>;
```

Props for `MesonFormDrawer` and `MesonFormDropdown` are almost same to `MesonFormModal`.

### Form fields

`IMesonFieldItem` 的不同类型, 对应的表单上的不同元素或者结构

- `Input`, 文本框类型, 设置 `textarea: true` 之后样式显示为多行输入, 逻辑保持一致. 默认属性用 `inputProps` 传入.
- `Number`, 数字类型,
- `Select`, 单选菜单, 需要传入 JSON 结构的 `options` 参数,
- `Radio`, 单选, 需要传入 JSON 结构的 `options` 参数,
- `Switch`, 开关类型,
- `Custom`, 自定义渲染, 需要定义渲染函数, 基于给出的表单的值和 `onChange` 函数进行渲染,
- `CustomMultiple`, 自定义渲染, 但是可以直接拿到 form 对象的, 进行渲染和校验, 相比 `Custom` 对应的多个字段.
- `Group`, 不嵌套的分组, 用在属性批量控制显示隐藏的情况,
- `Nested`, 嵌套的分组.
- `Decorative`, 自定义穿插 Node ，在 formItem 中间渲染不影响 formData 的对象

对于自定义渲染的位置, 配置 `Custom` 类型, 并且需要传入一个 `render` 方法用于渲染值以及操作区域,

```ts
{
  type: 'custom',
  name: "size",
  label: "自定义",
  render: (value, onChange, form, onCheck) => {
    return (
      <div className={row}>
        <div>
          <Input
            value={value}
            onChange={(event) => {
              let newValue = event.target.value;
              onChange(newValue);
            }}
            onBlur={() => {
              onCheck(value);
            }}
          />
        </div>
      </div>
    );
  },
},
```

其中,

- `onChange: (x: any) => void` 用来更新 `form` 当中当前字段的值.
- `onCheck: (x: any) => void` 用来校验当前该字段提供的值, 需要传入最新的值, 或者 `value` 认为是最新的值传入.

关于表单的具体参数:

```ts
export let MesonForm: FC<{
  /** 初始值, 后续的更新都在表单内部进行, 包括自定义渲染也是把修改传回到组件内部,
   * 可能会需要通过 key 重置表单, 比如 load 服务端数据回来需要重新初始化的情况
   */
  initialValue: any;
  /** JSON 结构的表单定义, 建议定义变量传过来, 一来定义会比较长, 二来 TS 类型推断在变量加类型的情况才准确 */
  items: IMesonFieldItem[];
  onSubmit: (form: { [k: string]: any }, onServerErrors?: (x: IMesonErrors) => void, transferData?: any) => void;
  onCancel?: () => void;
  className?: string;
  /**
   * items 所在区域容器的样式
   */
  itemsClassName?: string;
  /**
   * label 所在区域容器的样式
   */
  labelClassName?: string;
  /**
   * verification-error-text 所在区域容器的样式
   */
  errorClassName?: string;
  style?: CSSProperties;
  /**
   * Footer 默认提供了几种布局, 但是更可能还是需要直接提供一个渲染方案进行自定义
   */
  footerLayout?: EMesonFooterLayout;
  hideFooter?: boolean;
  /**
   * 控制 Label 是否不显示
   * 但优先级低于 `hideLabel` （IMesonFieldItem）
   */
  noLabel?: boolean;
  /**
   * 每个 item 输入框部分填满余下空间
   */
  fullWidth?: boolean;
  renderFooter?: (isLoading: boolean, onSubmit: () => void, onCancel: () => void) => ReactNode;
  isLoading?: boolean;
  /** 可能用在记录是否有修改的地方. 另外每个 item 上修改值的时候也有各自的 onChange 钩子 */
  onFieldChange?: (name: string, v: any, form: any, modifyForm: FuncMesonModifyForm<any>) => void;
  submitOnEdit?: boolean;
}> = (props) => {
  // Form
};
```

### Low level Hooks API

`useMesonCore` is a low level API for maintaining form states. The UI part need extra code.

```ts
let { formAny, errors, onCheckSubmit, checkItem, updateItem } = useMesonCore({
  initialValue: submittedForm,
  items: formItems,
  onSubmit: onSubmit,
});
```

### Workflow

https://github.com/jimengio/ts-workflow

### License

MIT
