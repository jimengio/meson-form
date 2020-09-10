import React, { FC, useEffect } from "react";
import { css, cx } from "emotion";
import { useAtom } from "@jimengio/rex";
import { useMesonFields } from "../../src/form";
import { IMesonFieldItem } from "../../src/model/types";
import Button from "antd/lib/button";

let PreviewMode: FC<{ className?: string }> = React.memo((props) => {
  let states = useAtom({
    items: [] as IMesonFieldItem[],
  });

  /** Plugins */

  let fields = useMesonFields({
    items: states.current.items || [],
    initialValue: {},
    onSubmit: (form) => {
      console.log("TODO", form);
    },
  });

  /** Methods */
  /** Effects */

  useEffect(() => {
    let handleMessage = (message: MessageEvent) => {
      console.log("message", message);

      let obj = message.data;

      if (obj.type === "items") {
        let items = eval(obj.code);

        console.log("generated items", items);

        states.swapWith((draft) => {
          draft.items = items || [];
        });
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  /** Renderers */
  return (
    <div className={props.className}>
      <div>{fields.ui}</div>
      <div className={cx(styleFooter)}>
        <Button
          children="Reset"
          onClick={() => {
            fields.resetForm({});
          }}
        />
        <div className={styleSpace} />
        <Button
          children="Check"
          onClick={() => {
            fields.checkAndSubmit();
          }}
        />
      </div>
    </div>
  );
});

export default PreviewMode;

let styleFooter = css`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px 16px;
`;

let styleSpace = css`
  width: 16px;
  height: 1px;
`;
