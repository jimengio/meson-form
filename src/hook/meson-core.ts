import { useState } from "react";
import { useImmer } from "use-immer";
import { IMesonFieldItem, EMesonFieldType, IMesonFieldItemHasValue, ISimpleObject } from "../model/types";
import { validateValueRequired, validateByMethods, validateItem } from "../util/validation";
import { traverseItems } from "../util/render";
import produce from "immer";

/** low level hook for creating forms with very specific UIs */
export let useMesonCore = (props: {
  initialValue: any;
  items: IMesonFieldItem[];
  onSubmit: (form: { [k: string]: any }, onServerErrors?: (x: ISimpleObject) => void) => void;
  onFieldChange?: (name: string, v: any, prevForm?: { [k: string]: any }) => void;
  submitOnEdit?: boolean;
}) => {
  let [form, updateForm] = useImmer(props.initialValue);
  let [errors, updateErrors] = useImmer({});
  let [modified, setModified] = useState<boolean>(false);

  let onCheckSubmitWithValue = (specifiedForm?: { [k: string]: any }) => {
    let latestForm = specifiedForm;
    let currentErrors: ISimpleObject = {};
    let hasErrors = false;
    traverseItems(props.items, (item: IMesonFieldItemHasValue) => {
      if (item.shouldHide != null && item.shouldHide(latestForm)) {
        return null;
      }

      let result = validateItem(latestForm[item.name], item);

      if (result != null) {
        currentErrors[item.name] = result;
        hasErrors = true;
      }
    });

    updateErrors((draft: ISimpleObject) => {
      return currentErrors;
    });

    if (!hasErrors) {
      props.onSubmit(latestForm, (serverErrors) => {
        updateErrors((draft: ISimpleObject) => {
          return serverErrors;
        });
      });
      setModified(false);
    }
  };

  let onCheckSubmit = () => {
    onCheckSubmitWithValue(form);
  };

  let checkItem = (item: IMesonFieldItemHasValue) => {
    if (props.submitOnEdit) {
      onCheckSubmitWithValue(form);
      return;
    }

    let result = validateItem(form[item.name], item);
    updateErrors((draft) => {
      draft[item.name] = result;
    });
  };

  let checkItemWithValue = (x: any, item: IMesonFieldItemHasValue) => {
    if (props.submitOnEdit) {
      let newForm = produce(form, (draft) => {
        draft[item.name] = x;
      });
      onCheckSubmitWithValue(newForm);
      return;
    }

    let result = validateItem(x, item);
    updateErrors((draft) => {
      draft[item.name] = result;
    });
  };

  let updateItem = (x: any, item: IMesonFieldItemHasValue) => {
    updateForm((draft: { [k: string]: any }) => {
      draft[item.name] = x;
    });
    setModified(true);
    if (item.onChange != null) {
      item.onChange(x);
    }
    if (props.onFieldChange != null) {
      props.onFieldChange(item.name, x, form);
    }
  };

  /** forcely */
  let forcelyResetForm = (newForm: any) => {
    updateForm((draft) => {
      return newForm;
    });
  };

  return {
    formAny: form,
    errors,
    isModified: modified,
    onCheckSubmit,
    onCheckSubmitWithValue,
    checkItem,
    checkItemWithValue,
    updateItem,
    forcelyResetForm,
  };
};
