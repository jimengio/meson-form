## Meson Form

> React form component with focus on immer and JSON

Snippets and Preview http://fe.jimu.io/meson-form/ . This library is now based on `antd@4.x` .

- [Chinese Intro](https://github.com/jimengio/meson-form/issues/159)
- [meson-drafter](http://tools.mvc-works.org/meson-drafter/) can be helpful in generating JSON configs.

### Usage

![](https://img.shields.io/npm/v/@jimengio/meson-form.svg?style=flat-square)

```bash
yarn add @jimengio/meson-form
```

Define forms JSON-like configs(with functions and enumerables):

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

Normal way of rendering a form(with cancel/submit buttons):

```tsx
import { MesonForm } from "@jimengio/meson-form";

<MesonForm
  initialValue={{}}
  items={formItems}
  onSubmit={(form) => {
    console.log("data to submit:", form);
  }}
/>;
```

Or, only render form fields, and control with your own buttons:

```tsx
import { useMesonFields } from "@jimengio/meson-form";

let fieldsPlugin = useMesonFields({
  initialValue: {},
  items: formItems,
  onSubmit: (form) => {
    console.log("After validation:", form);
  },
});

// ReactNode
fieldsPlugin.ui;

// trigger submit
fieldsPlugin.checkAndSubmit();

// reset form data
fieldsPlugin.resetForm(data);
```

### Modal usages

Used with a modal container:

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

Props for `MesonFormDrawer` and `MesonFormDropdown` are mostly same as `MesonFormModal`'s.

### Field Types

`IMesonFieldItem` has some types, roughly in 3 kinds:

- control types:

| Type              | Usage                         |
| ----------------- | ----------------------------- |
| `input`           | renders antd `<Input/>`       |
| `textarea`        | renders antd `<TextArea/>`    |
| `number`          | renders antd `<InputNumber/>` |
| `select`          | renders antd `<Select/>`      |
| `dropdown-select` | renders custom select         |
| `tree-select`     | renders antd `<TreeSelect/>`  |
| `dropdown-tree`   | renders cursom tree select    |
| `radio`           | renders radio groups          |
| `switch`          | renders antd `<Switch/>`      |
| `date-picker`     | renders antd `<DatePicker/>`  |

- custom control types:

| Type              | Usage                                                           |
| ----------------- | --------------------------------------------------------------- |
| `custom`          | render a custom ReactNode, corresponding to 1 property          |
| `custom-multiple` | render a custom ReactNode, controlling multiple form properties |
| `registered`      | render a user registered renderer, by a name                    |

- layout types:

| Type         | Usage                                                 |
| ------------ | ----------------------------------------------------- |
| `group`      | _no visual change, just grouping..._                  |
| `decorative` | any ReactNode, for decoration, no access to form data |
| `nested`     | get fields nested inside a field                      |

### Custom type

Custom type provides the chance to render your own field:

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

Notice the usages of those methods:

- `onChange: (x: any) => void` updates current property in form `form` data.
- `onCheck: (x: any) => void` perform validations on the value, which may cause its error message being displayed.

### Explanations on props

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

### Workflow

https://github.com/jimengio/ts-workflow

### License

MIT
