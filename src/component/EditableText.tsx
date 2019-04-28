import React, { useState } from 'react';
import AutosizeInput from 'react-input-autosize';

type Props = {
  value: string;
  onChange: (value: string) => void;

  maxLength?: number;
};

export default function EditableText({ value, onChange, maxLength }: Props) {
  const [edit, setEdit] = useState(false);
  const [editValue, setEditValue] = useState(value);

  return (
    <span className="editable-text">
      {edit ? (
        <span>
          <AutosizeInput
            autoFocus
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
          {value} <span className="icon-edit" />
        </span>
      )}
    </span>
  );
}

EditableText.defaultProps = {
  maxLength: null
};
