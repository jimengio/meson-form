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

### Workflow

https://github.com/jimengio/ts-workflow

### License

MIT
