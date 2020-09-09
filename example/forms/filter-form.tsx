import React, { FC, useState } from "react";
import { css } from "emotion";
import { DocDemo, DocSnippet } from "@jimengio/doc-frame";
import { useFilterForm, IFilterFieldItem } from "../../src/filter-form/core";
import DataPreview from "kits/data-preview";

interface IData {
  categoryId: string;
  isPublished: string;
  operatedAt: string;
}

let ExampleFilterForm: FC<{ className?: string }> = React.memo((props) => {
  let [data, setData] = useState({});

  /** Plugins */

  let filterFormItems: IFilterFieldItem<IData>[] = [
    {
      type: "select",
      label: "发布状态",
      name: "isPublished",
      allowClear: true,
      options: [
        { value: true, display: "已发布" },
        { value: false, display: "未发布" },
      ],
    },
    {
      type: "date-picker",
      label: "发布时间",
      name: "operatedAt",
    },
    {
      type: "dropdown-select",
      label: "类型",
      name: "categoryId",
      options: [
        { value: "a", display: "数据 A" },
        { value: "b", display: "数据 B" },
      ],
      allowClear: true,
      selectProps: {
        emptyLocale: "暂无数据",
      },
    },
  ];

  let filterForm = useFilterForm({
    items: filterFormItems,
    onItemChange: (filterResult) => {
      setData(filterResult);
    },
  });

  /** Methods */
  /** Effects */
  /** Renderers */
  return (
    <div className={props.className}>
      <DocDemo title={"Filters"} className={styleDemo}>
        {filterForm.ui}
        <DataPreview data={data} />

        <DocSnippet code={code} />
      </DocDemo>
    </div>
  );
});

export default ExampleFilterForm;

let styleDemo = css`
  max-width: 100%;
`;

let code = `
interface IData {
  categoryId: string;
  isPublished: string;
  operatedAt: string;
}

let filterFormItems: IFilterFieldItem<IData>[] = [
  {
    type: "select",
    label: "发布状态",
    name: "isPublished",
    allowClear: true,
    options: [
      { value: true, display: "已发布" },
      { value: false, display: "未发布" },
    ],
  },
  {
    type: "date-picker",
    label: "发布时间",
    name: "operatedAt",
  },
  {
    type: "dropdown-select",
    label: "类型",
    name: "categoryId",
    options: [
      { value: "a", display: "数据 A" },
      { value: "b", display: "数据 B" },
    ],
    allowClear: true,
    selectProps: {
      emptyLocale: "暂无数据",
    },
  }
];

let filterForm = useFilterForm({
  items: filterFormItems,
  onItemChange: (result) => {
    console.log(result)
  },
});

<div>{filterForm.ui}</div>
`;
