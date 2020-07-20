import { useState, useRef } from "react";
import { useImmer } from "use-immer";
import { IMesonFieldItem, IMesonFieldItemHasValue, FuncMesonModifyForm, IMesonCustomMultipleField, IMesonErrors, FieldValues, FieldName } from "../model/types";
import { validateItem, hasErrorInObject } from "../util/validation";
import { traverseItems, traverseItemsReachCustomMultiple } from "../util/render";
import produce, { Draft } from "immer";

export interface ICheckSubmitOptions<T extends FieldValues, TD> {
  onSubmit?: (form: T, onServerErrors?: (x: IMesonErrors<T>) => void, transferData?: any) => void;
  // pass from `checkAndSubmit` to `onSubmit`
  transferData?: TD;
}

/** low level hook for creating forms with very specific UIs */
export let useMesonCore = <T extends FieldValues, TransferData>(props: {
  initialValue: T;
  items: IMesonFieldItem<T>[];
  onSubmit: (form: T, onServerErrors?: (x: IMesonErrors<T>) => void, transferData?: any) => void;
  onFieldChange?: (name: FieldName<T>, v: any, prevForm?: T, modifyForm?: FuncMesonModifyForm<T>) => void;
  submitOnEdit?: boolean;
}) => {
  let [form, updateForm] = useImmer<T>(props.initialValue);
  let [errors, updateErrors] = useImmer<IMesonErrors<T>>({});
  let modifiedState = useRef(false);

  let onCheckSubmitWithValue = (passedForm?: T, options?: ICheckSubmitOptions<T, TransferData>) => {
    let latestForm = passedForm;
    let currentErrors: IMesonErrors<T> = {};
    let hasErrors = false;

    traverseItems(props.items, latestForm, async (i) => {
      const item = i as IMesonFieldItemHasValue<T>;
      let result = await validateItem(latestForm[item.name], item, form);
      if (result != null) {
        currentErrors[item.name] = result;
        hasErrors = true;
      }
    });

    traverseItemsReachCustomMultiple(props.items, latestForm, (i) => {
      const item = i as IMesonCustomMultipleField<T>;
      if ((item as IMesonCustomMultipleField<T>).validateMultiple) {
        let results = item.validateMultiple(latestForm, item);
        if (hasErrorInObject(results)) {
          Object.assign(currentErrors, results);
          hasErrors = true;
        }
      }
    });

    updateErrors((draft) => {
      return currentErrors;
    });

    if (!hasErrors) {
      let handleServerErrors = (serverErrors) => {
        // errors from server not in use yet
        updateErrors((draft) => {
          return serverErrors;
        });
      };

      if (props.onSubmit != null) {
        props.onSubmit(latestForm, handleServerErrors, options?.transferData);
      }

      if (options?.onSubmit != null) {
        options.onSubmit(latestForm, handleServerErrors, options?.transferData);
      }

      if (props.onSubmit == null && options?.onSubmit == null) {
        console.warn("onSubmit method not found! Either props.onSubmit or options.onSubmit should be provided");
      }

      modifiedState.current = false;
    }
  };

  let checkItemWithValue = async (x: any, item: IMesonFieldItemHasValue<T>) => {
    if (props.submitOnEdit) {
      let newForm = produce(form, (draft) => {
        draft[item.name] = x;
      });
      onCheckSubmitWithValue(newForm, null);
      return;
    }

    let result = await validateItem(x, item, form);
    updateErrors((draft) => {
      draft[`${item.name}`] = result;
    });
  };

  let checkItemCustomMultiple = (values: Partial<T>, item: IMesonCustomMultipleField<T>) => {
    let newForm = produce(form, (draft) => {
      Object.assign(draft, values);
    });

    if (props.submitOnEdit) {
      onCheckSubmitWithValue(newForm, null);
      return;
    }

    let results = item.validateMultiple ? item.validateMultiple(newForm, item) : {};
    updateErrors((draft) => {
      // reset errors of related fields first
      item.names.forEach((name) => {
        draft[`${name}`] = null;
      });
      Object.assign(draft, results);
    });
  };

  let updateItem = (x: any, item: IMesonFieldItemHasValue<T>) => {
    updateForm((draft) => {
      draft[item.name] = x;
    });
    modifiedState.current = true;
    if (item.onChange != null) {
      item.onChange(x, updateForm, {
        formData: form,
        updateForm: updateForm,
      });
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
    onCheckSubmit: (options?: ICheckSubmitOptions<T, TransferData>) => {
      onCheckSubmitWithValue(form, options);
    },
    onCheckSubmitWithValue,
    checkItem: (item: IMesonFieldItemHasValue<T>) => {
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
