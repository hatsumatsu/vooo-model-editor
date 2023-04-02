import { useEffect, useState } from "react";

function Slider({
  id,
  label,
  value = 0,
  setValue = () => {},
  min,
  max,
  step = 0.1,
  onChange = () => {}
}) {
  useEffect(() => {
    onChange(value);
  }, [value, onChange]);

  const onChangeValue = (event) => {
    setValue(event.target.value);
  };

  return (
    <div className="UIField Slider">
      <label className="UIField__label Slider__label">
        <span>{label}</span>
      </label>
      <input
        className="UIField__input Slider__slider"
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={onChangeValue}
      />

      <input
        className="UIField__input Slider__input Input"
        type="text"
        value={value}
        onChange={onChangeValue}
        data-align="right"
      />
    </div>
  );
}

export { Slider };
