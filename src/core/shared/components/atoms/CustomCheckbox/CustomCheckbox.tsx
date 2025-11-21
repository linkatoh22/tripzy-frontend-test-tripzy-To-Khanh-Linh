
import React, { useState } from 'react';


interface CheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({
  checked = false,
  onChange,
  label,
  disabled = false,
}) => {


  const handleClick = () => {
    if (!disabled && onChange) {
      onChange(!checked);
    }
  };

  return (
    <label className={`inline-flex items-center gap-2 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''} `}>
      <div
        onClick={handleClick}
        className={`
          w-4 h-4
          border rounded
          flex items-center justify-center
          transition-all duration-200
          ${checked ? 'bg-[#19C0FF] border-none' : 'bg-white border-[#CCCFD5]'}
          ${!disabled && 'hover:border-blue-400'}
          ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        {checked && (
            <img src="icons/CheckIcon.svg"/>
          
        )}
      </div>
      {label && (
        <span className={`font-medium text-[12px] leading-4 text-[#65686F] select-none ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
          {label}
        </span>
      )}
    </label>
  );
};

export default Checkbox;