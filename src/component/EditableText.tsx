import classnames from 'classnames';
import React, { useState } from 'react';
import AutosizeInput from 'react-input-autosize';

type Props = {
  value: string;
  onChange: (value: string) => void;

  placeholder?: string;
  maxLength?: number;
};

export default function EditableText({ value, onChange, placeholder, maxLength }: Props) {
  const [edit, setEdit] = useState(false);
  const [editValue, setEditValue] = useState(value);

  return (
    <span className={classnames('editable-text', { placeholder: !value && placeholder, edit })}>
      {edit ? (
        <span>
          <AutosizeInput
            autoFocus
            className="autosize-input"
            type="text"
            onBlur={() => {
              setEdit(false);
              onChange(editValue);
            }}
            onFocus={e => {
              e.currentTarget.select();
            }}
            value={editValue}
            onChange={e => setEditValue(e.target.value)}
            maxLength={maxLength}
          />
        </span>
      ) : (
        <span onClick={() => setEdit(true)}>
          {value || placeholder} <span className="icon-edit" />
        </span>
      )}
    </span>
  );
}

EditableText.defaultProps = {
  maxLength: null
};
