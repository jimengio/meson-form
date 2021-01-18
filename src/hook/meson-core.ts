import { useState, useRef } from "react";
import { useImmer } from "use-immer";
import { IMesonFieldItem, IMesonFieldItemHasValue, FuncMesonModifyForm, IMesonCustomMultipleField, IMesonErrors, FieldValues, FieldName } from "../model/types";
import { validateItem, hasErrorInObject } from "../util/validation";
import { traverseItems, traverseItemsReachCustomMultiple, asyncCustomeValidateItems } from "../util/render";
import produce, { Draft } from "immer";
import { union, isFunction, isEmpty } from "lodash-es";
import { isEmptyErrorsObject } from "../util/data";

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

  let onCheckSubmitWithValue = async (passedForm?: T, options?: ICheckSubmitOptions<T, TransferData>) => {
    let latestForm = passedForm;
    let currentErrors: IMesonErrors<T> = {};
    let hasErrors = false;

    traverseItems(props.items, latestForm, (i) => {
      const item = i as IMesonFieldItemHasValue<T>;
      let result = validateItem(latestForm[item.name], item, form);
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

    await asyncCustomeValidateItems(props.items, latestForm, async (i) => {
      switch (i.type) {
        case "custom-multiple":
          const multItem = i as IMesonCustomMultipleField<T>;
          if (isFunction(multItem.asyncValidateMultiple)) {
            let results = await multItem.asyncValidateMultiple(latestForm, multItem);
            if (hasErrorInObject(results)) {
              Object.assign(currentErrors, results);
              hasErrors = true;
            }
          }
          break;
        default:
          const item = i as IMesonFieldItemHasValue<T>;
          if (isFunction(item.asyncValidator)) {
            let result = await item.asyncValidator(latestForm[item.name], item, latestForm);
            if (result) {
              currentErrors[item.name] = result;
              hasErrors = true;
            }
          }
      }
    });

    updateErrors((draft) => {
      return currentErrors;
    });

    if (!hasErrors) {
      let handleServerErrors = (serverErrors: Partial<Record<FieldName<T>, string>>) => {
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

    let result = validateItem(x, item, form);

    // only after local validation is passed(or no validator), then try async one
    if (result == null && isFunction(item.asyncValidator)) {
      let result = await item.asyncValidator(x, item, form);
      updateErrors((draft) => {
        (draft as Record<string, any>)[`${item.name}`] = result;
      });
    } else {
      // errors checked locally
      updateErrors((draft) => {
        (draft as Record<string, any>)[`${item.name}`] = result;
      });
    }
  };

  let checkItemCustomMultiple = async (values: Partial<T>, item: IMesonCustomMultipleField<T>) => {
    let newForm = produce(form, (draft) => {
      Object.assign(draft, values);
    });

    if (props.submitOnEdit) {
      onCheckSubmitWithValue(newForm, null);
      return;
    }

    let results = item.validateMultiple ? item.validateMultiple(newForm, item) : {};

    if (isEmptyErrorsObject(results) && isFunction(item.asyncValidateMultiple)) {
      let results = await item.asyncValidateMultiple(newForm, item);
      updateErrors((draft) => {
        // reset errors of related fields first
        item.names.forEach((name) => {
          (draft as Record<string, any>)[`${name}`] = null;
        });
        Object.assign(draft, results);
      });
    } else {
      // errors checked locally
      updateErrors((draft) => {
        // reset errors of related fields first
        item.names.forEach((name) => {
          (draft as Record<string, any>)[name] = null;
        });
        Object.assign(draft, results);
      });
    }
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
        updateErrors: updateErrors,
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
