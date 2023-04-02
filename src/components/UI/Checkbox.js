import { useEffect, useState } from 'react';

function Checkbox({
  id,
  label,
  value = false,
  setValue = () => {},
  onChange = () => {}
}) {
  useEffect(() => {
    onChange(value);
  }, [value, onChange]);

  const onChangeValue = (event) => {
    console.log(event.target.checked);
    setValue(event.target.checked);
  };

  return (
    <div className="UIField Checkbox">
      <input
        className="UIField__input Checkbox__input"
        type="checkbox"
        value={value}
        onChange={onChangeValue}
        id={`Checkbox-${id}`}
      />

      <label
        className="UIField__label Checkbox__label"
        htmlFor={`Checkbox-${id}`}
      >
        <span>{label}</span>
      </label>
    </div>
  );
}

export { Checkbox };
