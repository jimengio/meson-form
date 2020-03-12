import { css } from "emotion";

export const styleInput = css`
  border-radius: 2px !important;
  border-color: #e8e8e8 !important;
  color: #323232 !important;

  &:focus,
  &:hover {
    border-color: #3674ff !important;
    box-shadow: 0px 0px 2px 0px rgba(6, 53, 171, 0.3) !important;
  }

  ::-webkit-input-placeholder {
    color: #979797 !important;
  }

  ::-moz-placeholder {
    color: #979797 !important;
  }

  :-ms-input-placeholder {
    color: #979797 !important;
  }
`;

export const styleSelect = css`
  .ant-select-selection {
    border-radius: 2px;
    border-color: #e8e8e8 !important;

    &:focus,
    &:hover {
      border-color: #3674ff !important;
      box-shadow: 0px 0px 2px 0px rgba(6, 53, 171, 0.3) !important;
    }

    .ant-select-selection__placeholder {
      color: #979797 !important;
    }

    .ant-select-selection-selected-value {
      color: #323232 !important;
    }
  }
`;

export const styleTextArea = css`
  border-color: #e8e8e8 !important;
  border-radius: 2px !important;
  color: #323232 !important;

  &:focus,
  &:hover {
    border-color: #3674ff !important;
    box-shadow: 0px 0px 2px 0px rgba(6, 53, 171, 0.3) !important;
  }

  ::-webkit-input-placeholder {
    color: #979797 !important;
  }

  ::-moz-placeholder {
    color: #979797 !important;
  }

  :-ms-input-placeholder {
    color: #979797 !important;
  }
`;

export const styleInputNumber = css`
  border-color: #e8e8e8 !important;
  border-radius: 2px !important;
  outline: none !important;
  box-shadow: none !important;

  input {
    color: #323232 !important;

    ::-webkit-input-placeholder {
      color: #979797 !important;
    }

    ::-moz-placeholder {
      color: #979797 !important;
    }

    :-ms-input-placeholder {
      color: #979797 !important;
    }
  }

  .ant-input-number-input-wrap {
    outline: none;
  }

  .ant-input-number-handler {
    color: #3674ff !important;
  }

  &:focus,
  &:hover {
    border-color: #3674ff !important;
    box-shadow: 0px 0px 2px 0px rgba(6, 53, 171, 0.3) !important;
  }
`;

export const styleSwitch = css`
  .ant-switch-checked {
    background-color: #3674ff !important;
  }
  .ant-switch {
    margin: 4px 0;
    background-color: #d6d6d6;
  }
`;

export const styleRadio = css`
  .ant-radio-checked .ant-radio-inner {
    border-color: #3674ff !important;
  }

  .ant-radio-checked .ant-radio-inner::after {
    background-color: #3674ff !important;
  }

  .ant-radio {
    &:hover {
      .ant-radio-inner {
        border-color: #3674ff !important;
      }
    }
  }

  .ant-radio-inner {
    border-color: #e8e8e8;
  }
`;

export const styleDatePicker = css`
  input {
    color: #323232 !important;
    border-color: #e8e8e8 !important;
    border-radius: 2px !important;
    &:focus,
    &:hover {
      border-color: #3674ff !important;
      box-shadow: 0px 0px 2px 0px rgba(6, 53, 171, 0.3) !important;
    }

    ::-webkit-input-placeholder {
      color: #979797 !important;
    }

    ::-moz-placeholder {
      color: #979797 !important;
    }

    :-ms-input-placeholder {
      color: #979797 !important;
    }
  }
`;

export const styleTree = css`
  .ant-select-selection {
    border-color: #e8e8e8 !important;
    border-radius: 2px !important;
    color: #323232 !important;
    &:focus,
    &:hover {
      border-color: #3674ff !important;
      box-shadow: 0px 0px 2px 0px rgba(6, 53, 171, 0.3) !important;
    }

    .ant-select-selection__placeholder,
    .ant-select-search__field__placeholder {
      color: #979797 !important;
    }
  }
`;
