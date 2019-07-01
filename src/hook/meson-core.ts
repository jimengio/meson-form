import { useState, useRef } from "react";
import { useImmer } from "use-immer";
import { IMesonFieldItem, IMesonFieldItemHasValue, FuncMesonModifyForm, IMesonCustomMultipleField, IMesonErrors } from "../model/types";
import { validateItem, hasErrorInObject } from "../util/validation";
import { traverseItems, traverseItemsReachCustomMultiple } from "../util/render";
import produce, { Draft } from "immer";

/** low level hook for creating forms with very specific UIs */
export let useMesonCore = <T>(props: {
  initialValue: T;
  items: IMesonFieldItem[];
  onSubmit: (form: T, onServerErrors?: (x: IMesonErrors<T>) => void) => void;
  onFieldChange?: (name: string, v: any, prevForm?: T, modifyForm?: FuncMesonModifyForm<T>) => void;
  submitOnEdit?: boolean;
}) => {
  let [form, updateForm] = useImmer(props.initialValue as T);
  let [errors, updateErrors] = useImmer({});
  let modifiedState = useRef(false);

  let onCheckSubmitWithValue = (passedForm?: T) => {
    let latestForm = passedForm;
    let currentErrors = {} as IMesonErrors<T>;
    let hasErrors = false;

    traverseItems(props.items, latestForm, (item: IMesonFieldItemHasValue) => {
      let result = validateItem(latestForm[item.name], item);
      if (result != null) {
        currentErrors[item.name] = result;
        hasErrors = true;
      }
    });

    traverseItemsReachCustomMultiple(props.items, latestForm, (item: IMesonCustomMultipleField<T>) => {
      let results = item.validateMultiple(latestForm, item);
      if (hasErrorInObject(results)) {
        Object.assign(currentErrors, results);
        hasErrors = true;
      }
    });

    updateErrors((draft: IMesonErrors<T>) => {
      return currentErrors;
    });

    if (!hasErrors) {
      props.onSubmit(latestForm, (serverErrors) => {
        // errors from server not in use yet
        updateErrors((draft: IMesonErrors<T>) => {
          return serverErrors;
        });
      });
      modifiedState.current = false;
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

  let checkItemCustomMultiple = (values: Partial<T>, item: IMesonCustomMultipleField<T>) => {
    let newForm = produce(form, (draft) => {
      Object.assign(draft, values);
    });

    if (props.submitOnEdit) {
      onCheckSubmitWithValue(newForm);
      return;
    }

    let results = item.validateMultiple(newForm, item);
    updateErrors((draft: T) => {
      // reset errors of related fields first
      item.names.forEach((name) => {
        draft[name as string] = null;
      });
      Object.assign(draft, results);
    });
  };

  let updateItem = (x: any, item: IMesonFieldItemHasValue) => {
    updateForm((draft: Draft<T>) => {
      draft[item.name] = x;
    });
    modifiedState.current = true;
    if (item.onChange != null) {
      item.onChange(x, updateForm);
    }
    if (props.onFieldChange != null) {
      props.onFieldChange(item.name, x, form, updateForm);
    }
  };

  return {
    formAny: form,
    updateForm,
    errors,
    updateErrors,
    isModified: modifiedState.current,
    onCheckSubmit: () => {
      onCheckSubmitWithValue(form);
    },
    onCheckSubmitWithValue,
    checkItem: (item: IMesonFieldItemHasValue) => {
      checkItemWithValue(form[item.name], item);
    },
    checkItemCustomMultiple,
    checkItemWithValue,
    updateItem,
    resetModified: () => {
      modifiedState.current = false;
    },
  };
};
