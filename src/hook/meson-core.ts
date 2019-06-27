import { useState } from "react";
import { useImmer } from "use-immer";
import { IMesonFieldItem, EMesonFieldType, IMesonFieldItemHasValue, ISimpleObject, FuncMesonModifyForm, IMesonFieldHighlyCustomized } from "../model/types";
import { validateValueRequired, validateByMethods, validateItem, hasErrorInObject } from "../util/validation";
import { traverseItems, traverseItemsReachHighlyCustomized } from "../util/render";
import produce from "immer";

/** low level hook for creating forms with very specific UIs */
export let useMesonCore = (props: {
  initialValue: any;
  items: IMesonFieldItem[];
  onSubmit: (form: { [k: string]: any }, onServerErrors?: (x: ISimpleObject) => void) => void;
  onFieldChange?: (name: string, v: any, prevForm?: { [k: string]: any }, modifyFormObject?: FuncMesonModifyForm) => void;
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

    traverseItemsReachHighlyCustomized(props.items, (item: IMesonFieldHighlyCustomized) => {
      if (item.shouldHide != null && item.shouldHide(latestForm)) {
        return null;
      }

      let results = item.validateRelated(latestForm, item);
      if (hasErrorInObject(results)) {
        Object.assign(currentErrors, results);
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

  let checkItemHighlyCustomized = (values: any, item: IMesonFieldHighlyCustomized) => {
    let newForm = produce(form, (draft) => {
      Object.assign(draft, values);
    });

    if (props.submitOnEdit) {
      onCheckSubmitWithValue(newForm);
      return;
    }

    let results = item.validateRelated(newForm, item);
    updateErrors((draft) => {
      // reset errors of related fields first
      item.names.forEach((name) => {
        draft[name] = null;
      });
      Object.assign(draft, results);
    });
  };

  let updateItem = (x: any, item: IMesonFieldItemHasValue) => {
    updateForm((draft: { [k: string]: any }) => {
      draft[item.name] = x;
    });
    setModified(true);
    if (item.onChange != null) {
      item.onChange(x, updateForm);
    }
    if (props.onFieldChange != null) {
      props.onFieldChange(item.name, x, form, updateForm);
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
    updateForm,
    errors,
    updateErrors,
    isModified: modified,
    onCheckSubmit: () => {
      onCheckSubmitWithValue(form);
    },
    onCheckSubmitWithValue,
    checkItem: (item: IMesonFieldItemHasValue) => {
      checkItemWithValue(form[item.name], item);
    },
    checkItemHighlyCustomized,
    checkItemWithValue,
    updateItem,
    forcelyResetForm,
  };
};
